import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SignupComponent } from './signup.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { PasswordStrengthMeterModule } from 'angular-password-strength-meter';

@NgModule({
  declarations: [SignupComponent],
  exports: [SignupComponent],
  imports: [CommonModule, FormsModule, IonicModule, ReactiveFormsModule, PasswordStrengthMeterModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class SignupModule {}
