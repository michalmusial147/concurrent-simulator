import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-client',
  template: `
    <table mat-table [dataSource]="dataSource" class="mat-elevation-z8">

      <!-- Position Column -->
      <ng-container matColumnDef="position">
        <th mat-header-cell *matHeaderCellDef> No. </th>
        <td mat-cell *matCellDef="let element"> {{element.position}} </td>
      </ng-container>

      <!-- Name Column -->
      <ng-container matColumnDef="name">
        <th mat-header-cell *matHeaderCellDef> Name </th>
        <td mat-cell *matCellDef="let element"> {{element.name}} </td>
      </ng-container>

      <!-- Weight Column -->
      <ng-container matColumnDef="weight">
        <th mat-header-cell *matHeaderCellDef> Weight </th>
        <td mat-cell *matCellDef="let element"> {{element.weight}} </td>
      </ng-container>

      <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
      <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
    </table>
  `,
  styleUrls: ['./client.component.scss']
})
export class ClientComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }
  displayedColumns: string[] = ['position', 'name', 'weight', 'symbol'];
  dataSource= [];
}
