import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { PickStackNameComponent } from './pick-stack-name.component';

describe('PickStackNameComponent', () => {
  let component: PickStackNameComponent;
  let fixture: ComponentFixture<PickStackNameComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PickStackNameComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(PickStackNameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
