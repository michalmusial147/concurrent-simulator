import {Component, Input, OnInit} from '@angular/core';
import {Node} from '../../model/client-data';

@Component({
  selector: 'app-server-view',
  template: `
    <div class="column">
      <app-node *ngFor="let node of nodes " [node]="node"></app-node>
    </div>
  `,
  styleUrls: ['./server-view.component.scss']
})
export class ServerViewComponent implements OnInit {

  @Input()nodes: Node[];
  constructor() { }

  ngOnInit(): void {
  }

}
