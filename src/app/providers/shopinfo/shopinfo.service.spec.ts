import { TestBed } from '@angular/core/testing';

import { ShopifyInfoStoreService } from './shopinfo.service';

describe('ShopInfoService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ShopifyInfoStoreService = TestBed.get(ShopifyInfoStoreService);
    expect(service).toBeTruthy();
  });
});
