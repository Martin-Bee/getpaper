import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from 'src/app/providers/user/user.service';
import * as text from 'src/app/resources/resource.json';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.page.html',
  styleUrls: ['./forgot-password.page.scss']
})
export class ForgotPasswordPage implements OnInit {
  forgotPassword: FormGroup;
  msgSuccess: string;
  msgError: string;

  constructor(public formBuilder: FormBuilder, public userService: UserService) {}

  ngOnInit(): void {
    this.forgotPassword = this.formBuilder.group({
      email: ['', Validators.compose([Validators.required, Validators.email])]
    });
  }

  /**
   * Clicking on the button
   */
  async sendResetEmail(): Promise<void> {
    if (!this.forgotPassword.valid) {
      this.msgError = 'Please enter a valid email.';
      return;
    }
    this.msgError = null;
    const email = this.forgotPassword.get('email').value.toLowerCase();
    const response = await this.userService.resetPassword(email);
    console.log('Response: ' + response);
    this.msgSuccess = text.reset_email_instructions;
  }
}
