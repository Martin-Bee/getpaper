import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BrandStacksPage } from './brand-stacks.page';

describe('BrandStacksPage', () => {
  let component: BrandStacksPage;
  let fixture: ComponentFixture<BrandStacksPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BrandStacksPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BrandStacksPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
