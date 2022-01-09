import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-server-view',
  template: `
    <div class="column">
      <app-node *ngFor="let id of nodeIds " [nodeId]="id.toString()"></app-node>
    </div>
  `,
  styleUrls: ['./server-view.component.scss']
})
export class ServerViewComponent implements OnInit {

  nodeIds = [1, 2, 3, 4, 5];
  constructor() { }

  ngOnInit(): void {
  }

}
