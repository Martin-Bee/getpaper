import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ShopifySetupComponent } from './shopify-setup.component';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { AllowPushWebModule } from 'src/app/components/allow-push-web/allow-push-web.module';

@NgModule({
  imports: [CommonModule, IonicModule, FormsModule, AllowPushWebModule],
  declarations: [ShopifySetupComponent],
  exports: [ShopifySetupComponent]
})
export class ShopifySetupModule {}
