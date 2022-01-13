import {Component, Input, OnInit} from '@angular/core';
import {Node, NodeStatus} from '../../model/client-data';

@Component({
  selector: 'app-node',
  template: `
    <mat-card class="node">
      <mat-card-header>
        <div mat-card-avatar><mat-icon aria-hidden="false" aria-label="Example home icon">folder</mat-icon></div>
        <mat-card-title>Node {{node.nodeId}}</mat-card-title>
        <mat-card-subtitle>{{renderStatus()}}</mat-card-subtitle>
      </mat-card-header>
    </mat-card>
  `,
  styleUrls: ['./node.component.scss']
})
export class NodeComponent implements OnInit {

  @Input() node: Node;
  constructor() { }

  ngOnInit(): void {
  }

  renderStatus():string{
    if(NodeStatus.WAITING === this.node.status){
      return 'waiting'
    }
    else return 'downloading file: ' + this.node.fileId + ' from client: ' + this.node.clientId;
  }
}
