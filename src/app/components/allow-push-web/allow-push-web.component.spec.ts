import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { AllowPushWebComponent } from './allow-push-web.component';

describe('AllowPushWebComponent', () => {
  let component: AllowPushWebComponent;
  let fixture: ComponentFixture<AllowPushWebComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AllowPushWebComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(AllowPushWebComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
