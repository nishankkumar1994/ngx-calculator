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
  isDraggable = false;
  openInlineCalc() {
    this.isFixedOpen = false;
    this.isOpen = true;
  }
  openFixedCalc() {
    this.isOpen = true;
    this.isFixedOpen = true;
  }
  closeCalc() {
    this.isOpen = false;
  }
  draggableToggle(e) {
    console.log('---', e.target.checked);
    this.isDraggable = e.target.checked;
  }
}
