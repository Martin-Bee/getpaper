import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SignupLoginComponent } from './signup-login.component';
import { SignupModule } from 'src/app/account/signup/signup.module';
import { LoginModule } from 'src/app/account/login/login.module';
import { IonicModule } from '@ionic/angular';

@NgModule({
  declarations: [SignupLoginComponent],
  imports: [CommonModule, IonicModule, SignupModule, LoginModule],
  exports: [SignupLoginComponent]
})
export class SignupLoginModule {}
