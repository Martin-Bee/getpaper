import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AccountSecurityPageRoutingModule } from './account-security-routing.module';

import { AccountSecurityPage } from './account-security.page';
import { OptionMenuModule } from 'src/app/components/option-menu/option-menu.module';

@NgModule({
  imports: [CommonModule, FormsModule, IonicModule, AccountSecurityPageRoutingModule, OptionMenuModule],
  declarations: [AccountSecurityPage]
})
export class AccountSecurityPageModule {}
