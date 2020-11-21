import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MobileHeaderMenuComponent } from './mobile-header-menu.component';

describe('HeaderMenuComponent', () => {
  let component: MobileHeaderMenuComponent;
  let fixture: ComponentFixture<MobileHeaderMenuComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [MobileHeaderMenuComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MobileHeaderMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
