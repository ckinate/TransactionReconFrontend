import { TestBed } from '@angular/core/testing';

import { EnhancedSpinnerService } from './enhanced-spinner.service';

describe('EnhancedSpinnerService', () => {
  let service: EnhancedSpinnerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EnhancedSpinnerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
