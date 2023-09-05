import { TestBed } from '@angular/core/testing';

import { AircraftDetectionService } from './aircraft-detection.service';

describe('AircraftDetectionService', () => {
  let service: AircraftDetectionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AircraftDetectionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
