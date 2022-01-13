import {Component, OnInit} from '@angular/core';
import {ClientData, ClientStatus, File, Node, NodeStatus} from './model/client-data';
import {MatButtonToggleChange} from '@angular/material/button-toggle';
import {interval, Subject, Subscription} from 'rxjs';


function rand(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1) + min)
}


function calcScore(file: File, waitingFrom: Date): number{
  return file.weight + waitingFrom.getSeconds();
}

@Component({
  selector: 'app-root',
  template: `
    <div class="header1">
      <div>Concurrent</div>
      <div class="timer">{{time}}</div>
    </div>
    <div class="header2">
      <mat-button-toggle-group (change)="startToggleChanged($event)" name="fontStyle" aria-label="Font Style">
        <mat-button-toggle value="start">Start</mat-button-toggle>
        <mat-button-toggle value="stop">Stop</mat-button-toggle>
      </mat-button-toggle-group>
      <button mat-raised-button color="primary" (click)="clear()">Clear</button>
      <button mat-raised-button color="primary" (click)="init()">Init</button>
      <button mat-raised-button color="primary">Add</button>
<!--      <mat-checkbox-->
<!--        class="checkbox-theme"-->
<!--        color="primary"-->
<!--        [(ngModel)]="checked"-->
<!--        [(indeterminate)]="indeterminate"-->
<!--        [labelPosition]="labelPosition"-->
<!--        [disabled]="disabled">-->
<!--        Stop on auction-->
<!--      </mat-checkbox>-->
      <mat-form-field class="interval-form-field" appearance="outline">
        <mat-label>Interval</mat-label>
        <input matInput type="number" [(ngModel)]="speed" (change)="speedChanged($event)">
      </mat-form-field>
    </div>
    <div class="main-wrapper">
      <app-server-view [nodes]="nodes"></app-server-view>
      <app-clients-view [clients]="clients" (remove)="removeClient($event)"></app-clients-view>
    </div>
  `,
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  private title = 'app';
  checked = false;
  indeterminate = false;
  labelPosition: 'before' | 'after' = 'after';
  disabled = false;
  clients: ClientData[] = [];
  startToggle: 'start';
  speed: number = 10000;
  sourceRaw$ = interval(1);
  toggleState: string = 'stop;'
  source$ = new Subject<number>();
  time: string = '00.0.00'
  fileID: number = 0;
  nodes: Node[];
  private currentSubscription: Subscription = new Subscription();


  ngOnInit(): void {
    this.source$.subscribe(val => {
      var today = new Date();
      this.time =
        today.getHours() + ":" + (((today.getMinutes()).valueOf() < 10) ? '0' + today.getMinutes().toString() : today.getMinutes()).toString() + ":" + today.getSeconds();
      this.clients.filter(client => client.status === ClientStatus.SENDING_FILE)
        .forEach(client => {
          client.files[0].sent += 1;
          if(client.files[0].sent >= client.files[0].weight){
            client.waitingFrom = new Date();
            client.status = ClientStatus.WAITING;
            const clientNode = this.nodes.find(node => node.nodeId === client.nodeId)
            if (clientNode) {
              clientNode.status = NodeStatus.WAITING;
            }
          client.files.shift();
          }
        });
        this.nodes.forEach(node => {
            if (node.status === NodeStatus.PROCESSING_FILE) {
              if(!this.clients.find(client => client.clientId === node.clientId)){
                node.status = NodeStatus.WAITING;
              }
            }
            if (node.status === NodeStatus.WAITING && this.clients.length > 0) {
              const client:ClientData = this.clients
                .filter(client => client.status === ClientStatus.WAITING)
                .filter(client => client.files.length > 0)
                .reduce(function(prev, curr) {
                  return (calcScore(prev.files[0], prev.waitingFrom) < calcScore(curr.files[0], curr.waitingFrom))
                      ? prev : curr;
                });
              if(client){
                client.waitingFrom = new Date();
                client.nodeId = node.nodeId;
                client.status = ClientStatus.SENDING_FILE;
                node.fileId = client.files[0].fileId;
                node.clientId = client.clientId;
                node.status = NodeStatus.PROCESSING_FILE;
              }
            }
          }
      )
    });
    this.currentSubscription.unsubscribe();
    this.currentSubscription = this.sourceRaw$.subscribe(value => {
      if (this.toggleState === 'start') {
        this.source$.next(value);
      }
    });
  }

  clear() {
    this.clients = [];
  }

  init() {
    this.nodes = [
      {
        nodeId: "1",
        status: NodeStatus.WAITING
      },
      {
        nodeId: "2",
        status: NodeStatus.WAITING
      },
      {
        nodeId: '3',
        status: NodeStatus.WAITING
      },
      {
        nodeId: "4",
        status: NodeStatus.WAITING
      },
      {
        nodeId: "5",
        status: NodeStatus.WAITING
      }
    ];
    this.clients = [];
    const now = new Date();
    const clientsCount = rand(6, 15);
    for (let i = 0; i < clientsCount; i++) {
      const filesCount = rand(3, 6);
      let newClient: ClientData = {
        clientId: i.toString(),
        files: [],
        waitingFrom: now,
        status: ClientStatus.WAITING,
        score: 0,
      };
      for (let j = 0; j < filesCount; j++, this.fileID++) {
        newClient.files.push(
          {
            fileId: this.fileID.toString(),
            weight: this.randomWeight(),
            sent: 0,
          })
      }
      newClient.files.sort(this.compare);
      this.clients.push(newClient);
    }
  }

  startToggleChanged($event: MatButtonToggleChange) {
    this.toggleState = $event.value;
  }

  private randomWeight(): number {
    switch (rand(0, 2)) {
      case 0:
        return rand(10, 1000)
      case 1:
        return rand(100, 10000)
      case 2:
        return rand(10000, 100000)
    }
    return rand(100000, 1000000)
  }

  compare( a:File, b:File ) {
    if ( a.weight < b.weight ){
      return -1;
    }
    if ( a.weight > b.weight ){
      return 1;
    }
    return 0;
  }

  speedChanged($event: Event) {
    console.log(this.speed)
    this.currentSubscription.unsubscribe();
    this.sourceRaw$ = interval(this.speed);
    this.currentSubscription = this.sourceRaw$.subscribe(value => {
      if (this.toggleState === 'start') {
        this.source$.next(value);
      }
    });
  }

  removeClient($event: any) {
    this.clients.splice(this.clients.findIndex(client => client.clientId === $event), 1);
  }

}
