import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AccountInfoPageRoutingModule } from './account-info-routing.module';

import { AccountInfoPage } from './account-info.page';
import { OptionMenuModule } from 'src/app/components/option-menu/option-menu.module';
import { ShopifySetupModule } from 'src/app/components/shopify-setup/shopify-setup.module';
import { StripeConnectModule } from 'src/app/components/stripe-connect/stripe-connect.module';
import { AddressAutocompleteModule } from 'src/app/components/address-autocomplete/address-autocomplete.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AccountInfoPageRoutingModule,
    OptionMenuModule,
    ShopifySetupModule,
    StripeConnectModule,
    AddressAutocompleteModule
  ],
  declarations: [AccountInfoPage],
  entryComponents: []
})
export class AccountInfoPageModule {}
