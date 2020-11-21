import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { StripeSetupPage } from './stripe-setup.page';

describe('StripeSetupPage', () => {
  let component: StripeSetupPage;
  let fixture: ComponentFixture<StripeSetupPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StripeSetupPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(StripeSetupPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
