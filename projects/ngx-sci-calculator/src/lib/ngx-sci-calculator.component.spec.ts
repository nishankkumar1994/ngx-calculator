import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NgxSciCalculatorComponent } from './ngx-sci-calculator.component';

describe('NgxSciCalculatorComponent', () => {
  let component: NgxSciCalculatorComponent;
  let fixture: ComponentFixture<NgxSciCalculatorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NgxSciCalculatorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NgxSciCalculatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
