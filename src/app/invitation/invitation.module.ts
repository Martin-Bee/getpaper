import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { InvitationPage } from './invitation.page';

import { PipesModule } from 'src/app/pipes/pipes.module';
import { HeaderInviteeModule } from './header-invitee/header-invitee.module';
import { ErrorMessageModule } from 'src/app/components/error-message/error-message.module';
import { DisplayProductsModule } from './display-products/display-products.module';
import { SignupLoginModule } from 'src/app/account/signup-login/signup-login.module';
import { ScheduleOrderModule } from './schedule-order/schedule-order.module';
import { ChooseAddressModule } from './choose-address/choose-address.module';
import { StripePayModule } from 'src/app/components/stripe-pay/stripe-pay.module';
import { CongratulationsModule } from './congratulations/congratulations.module';

const routes: Routes = [
  {
    path: '',
    component: InvitationPage
  }
];

@NgModule({
  entryComponents: [],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes),
    ReactiveFormsModule,
    PipesModule,
    HeaderInviteeModule,
    ErrorMessageModule,
    DisplayProductsModule,
    SignupLoginModule,
    ScheduleOrderModule,
    ChooseAddressModule,
    StripePayModule,
    CongratulationsModule
  ],
  declarations: [InvitationPage],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class InvitationPageModule {}
