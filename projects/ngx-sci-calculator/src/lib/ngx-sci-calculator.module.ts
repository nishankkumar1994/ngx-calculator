import { NgModule } from '@angular/core';
import { NgxSciCalculatorComponent } from './ngx-sci-calculator.component';
import { CommonModule } from '@angular/common';
import { DragDropModule } from '@angular/cdk/drag-drop';



@NgModule({
  declarations: [NgxSciCalculatorComponent],
  imports: [
    CommonModule,
    DragDropModule
  ],
  exports: [NgxSciCalculatorComponent]
})
export class NgxSciCalculatorModule { }
