import { TestBed } from '@angular/core/testing';

import { StacksService } from './stacks.service';

describe('StacksService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: StacksService = TestBed.get(StacksService);
    expect(service).toBeTruthy();
  });
});
