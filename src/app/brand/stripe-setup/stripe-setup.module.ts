import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { StripeSetupPage } from './stripe-setup.page';
import { Routes, RouterModule } from '@angular/router';
import { OptionMenuModule } from 'src/app/components/option-menu/option-menu.module';

const routes: Routes = [
  {
    path: '',
    component: StripeSetupPage
  }
];

@NgModule({
  entryComponents: [],
  imports: [CommonModule, FormsModule, IonicModule, RouterModule.forChild(routes), OptionMenuModule],
  declarations: [StripeSetupPage]
})
export class StripeSetupPageModule {}
