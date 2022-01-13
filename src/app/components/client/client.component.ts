import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {ClientData, ClientStatus} from '../../model/client-data';

@Component({
  selector: 'app-client',
  template: `
    <mat-card>
      <mat-card-header>
        <div mat-card-avatar>
          <mat-icon aria-hidden="false" aria-label="Example home icon">account_circle</mat-icon>
        </div>
        <mat-card-title>Client {{client.clientId}}</mat-card-title>
        <mat-card-subtitle>{{renderStatus()}}</mat-card-subtitle>
      </mat-card-header>
      <mat-card-content>
        <app-client-files [files]="client.files"></app-client-files>
      </mat-card-content>
      <mat-card-actions style="display: flex; justify-content: end">
        <button (click)="removeClient()" mat-icon-button color="accent" aria-label="Example icon button with a home icon">
          <mat-icon>delete</mat-icon>
        </button>
      </mat-card-actions>
    </mat-card>
  `,
  styleUrls: ['./client.component.scss']
})
export class ClientComponent implements OnInit {

  @Input() client: ClientData;
  @Output() remove = new EventEmitter<string>();
  constructor() { }

  ngOnInit(): void {
  }

  renderStatus() {
    if(this.client.status === ClientStatus.WAITING){
      var date = this.client.waitingFrom
      return 'Waiting from '
        + date.getHours() + ":"
        + (((date.getMinutes()).valueOf() < 10) ? '0' + date.getMinutes().toString() : date.getMinutes()).toString()
        + ":" + date.getSeconds();
    }
    else return 'Sending file with id: ' + this.client.files[0].fileId + ' to node ' + this.client.nodeId
  }

  removeClient() {
    this.remove.emit(this.client.clientId);
  }
}
