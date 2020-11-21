import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CustLoaderComponent } from './cust-loader.component';

describe('CustLoaderComponent', () => {
  let component: CustLoaderComponent;
  let fixture: ComponentFixture<CustLoaderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CustLoaderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustLoaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
