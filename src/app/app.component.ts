import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  template: `
    <div class="header">
      Concurrent
    </div>
    <div class="margin-top-15">
      <app-server-view></app-server-view>
    </div>
  `,
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'app';
}
