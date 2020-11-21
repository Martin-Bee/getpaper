import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { BrandDashboardPage } from './brand-dashboard.page';
import { OptionMenuModule } from 'src/app/components/option-menu/option-menu.module';
import { ShopifySetupModule } from 'src/app/components/shopify-setup/shopify-setup.module';

const routes: Routes = [
  {
    path: '',
    component: BrandDashboardPage
  }
];

@NgModule({
  imports: [CommonModule, FormsModule, IonicModule, RouterModule.forChild(routes), OptionMenuModule, ShopifySetupModule],
  declarations: [BrandDashboardPage],
  entryComponents: [],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class BrandDashboardPageModule {}
