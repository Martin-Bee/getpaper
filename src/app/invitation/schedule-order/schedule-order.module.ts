import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ScheduleOrderComponent } from './schedule-order.component';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

@NgModule({
  declarations: [ScheduleOrderComponent],
  imports: [CommonModule, FormsModule, IonicModule],
  exports: [ScheduleOrderComponent]
})
export class ScheduleOrderModule {}
