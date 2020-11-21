import { TestBed } from '@angular/core/testing';

import { LSUAuthService } from './lsuauth.service';

describe('LSUAuthServiceService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: LSUAuthService = TestBed.get(LSUAuthService);
    expect(service).toBeTruthy();
  });
});
