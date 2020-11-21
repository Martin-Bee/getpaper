import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { BrandStacksPage } from './brand-stacks.page';
import { PipesModule } from 'src/app/pipes/pipes.module';
import { OptionMenuModule } from 'src/app/components/option-menu/option-menu.module';
import { StripeConnectModule } from 'src/app/components/stripe-connect/stripe-connect.module';
import { InvitesModule } from 'src/app/components/invites/invites.module';
import { SocialShareModule } from 'src/app/components/social-share/social-share.module';
import { PickStackNameComponent } from './pick-stack-name/pick-stack-name.component';
import { ProductPickerComponent } from './product-picker/product-picker.component';
import { OrganizeProductComponent } from './organize-product/organize-product.component';
import { FinalizeProductComponent } from './finalize-product/finalize-product.component';
import { ErrorMessageModule } from 'src/app/components/error-message/error-message.module';

const routes: Routes = [
  {
    path: '',
    component: BrandStacksPage
  }
];

@NgModule({
  entryComponents: [],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes),
    PipesModule,
    OptionMenuModule,
    StripeConnectModule,
    InvitesModule,
    SocialShareModule,
    ErrorMessageModule
  ],
  declarations: [BrandStacksPage, PickStackNameComponent, ProductPickerComponent, OrganizeProductComponent, FinalizeProductComponent]
})
export class BrandStacksPageModule {}
