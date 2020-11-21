import { TestBed } from '@angular/core/testing';

import { FireDataService } from './fire-data.service';

describe('FireDataService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: FireDataService = TestBed.get(FireDataService);
    expect(service).toBeTruthy();
  });
});
