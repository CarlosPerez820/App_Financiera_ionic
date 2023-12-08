import { TestBed } from '@angular/core/testing';

import { RenovacionService } from './renovacion.service';

describe('RenovacionService', () => {
  let service: RenovacionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RenovacionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
