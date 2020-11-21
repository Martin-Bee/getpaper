import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';

import { SignupPage } from './signup.page';
import { HeaderModule } from 'src/app/components/header/header.module';
import { FooterModule } from 'src/app/components/footer/footer.module';
import { SignupModule } from 'src/app/account/signup/signup.module';
import { IonicModule } from '@ionic/angular';

const routes: Routes = [
  {
    path: '',
    component: SignupPage
  }
];

@NgModule({
  imports: [CommonModule, IonicModule, RouterModule.forChild(routes), HeaderModule, FooterModule, SignupModule],
  declarations: [SignupPage]
})
export class SignupPageModule {}
