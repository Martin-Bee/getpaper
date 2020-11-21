import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BrandHomePage } from './brand-home.page';

describe('BrandHomePage', () => {
  let component: BrandHomePage;
  let fixture: ComponentFixture<BrandHomePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [BrandHomePage],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BrandHomePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
