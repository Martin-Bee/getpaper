import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InvitesComponent } from './invites.component';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { ErrorMessageModule } from 'src/app/components/error-message/error-message.module';
import { SignupLoginModule } from 'src/app/account/signup-login/signup-login.module';

@NgModule({
  declarations: [InvitesComponent],
  imports: [CommonModule, FormsModule, IonicModule, ErrorMessageModule, SignupLoginModule],
  exports: [InvitesComponent]
})
export class InvitesModule {}
