import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StripePayComponent } from './stripe-pay.component';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { ErrorMessageModule } from 'src/app/components/error-message/error-message.module';

@NgModule({
  declarations: [StripePayComponent],
  imports: [CommonModule, FormsModule, IonicModule, ErrorMessageModule],
  exports: [StripePayComponent]
})
export class StripePayModule {}
