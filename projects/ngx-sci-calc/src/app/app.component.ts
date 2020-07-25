import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'ngx-sci-calc';
  isOpen=false;
  isFixedOpen=false;
  openInlineCalc() {
    this.isOpen = true;
  }
  closeInlineCalc() {
    this.isOpen = false;
  }
  openFixedCalc() {
    this.isFixedOpen = true;
  }
  closeFixedCalc() {
    this.isFixedOpen = false;
  }
}
