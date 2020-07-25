import { TestBed } from '@angular/core/testing';

import { NgxSciCalculatorService } from './ngx-sci-calculator.service';

describe('NgxSciCalculatorService', () => {
  let service: NgxSciCalculatorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NgxSciCalculatorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
