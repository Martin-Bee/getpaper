import { TestBed } from '@angular/core/testing';

import { ShipStationService } from './ship-station.service';

describe('ShipStationService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ShipStationService = TestBed.get(ShipStationService);
    expect(service).toBeTruthy();
  });
});
