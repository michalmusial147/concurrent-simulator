import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-node',
  template: `
    <mat-card>
      <mat-card-header>
        <div mat-card-avatar><mat-icon aria-hidden="false" aria-label="Example home icon">folder</mat-icon></div>
        <mat-card-title>{{nodeId}}</mat-card-title>
        <mat-card-subtitle>processing file</mat-card-subtitle>
      </mat-card-header>
    </mat-card>
  `,
  styleUrls: ['./node.component.scss']
})
export class NodeComponent implements OnInit {

  @Input() nodeId: string;
  constructor() { }

  ngOnInit(): void {
  }

}
