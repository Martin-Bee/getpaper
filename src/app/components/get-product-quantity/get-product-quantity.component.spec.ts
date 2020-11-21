import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GetProductQuantityComponent } from './get-product-quantity.component';

describe('GetProductQuantityComponent', () => {
  let component: GetProductQuantityComponent;
  let fixture: ComponentFixture<GetProductQuantityComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [GetProductQuantityComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GetProductQuantityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
