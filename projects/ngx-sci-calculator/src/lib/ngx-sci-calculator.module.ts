import { NgModule } from '@angular/core';
import { NgxSciCalculatorComponent } from './ngx-sci-calculator.component';
import { CommonModule } from '@angular/common';



@NgModule({
  declarations: [NgxSciCalculatorComponent],
  imports: [
    CommonModule
  ],
  exports: [NgxSciCalculatorComponent]
})
export class NgxSciCalculatorModule { }
