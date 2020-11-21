import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StripeConnectComponent } from './stripe-connect.component';
import { IonicModule } from '@ionic/angular';

@NgModule({
  declarations: [StripeConnectComponent],
  imports: [CommonModule, IonicModule],
  exports: [StripeConnectComponent]
})
export class StripeConnectModule {}
