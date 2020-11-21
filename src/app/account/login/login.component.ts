import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { UserService } from 'src/app/providers/user/user.service';
import { NavController } from '@ionic/angular';
import * as text from 'src/app/resources/resource.json';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  // Our Login Variables
  @Input() simpleVersion: boolean;
  loginForm: FormGroup;
  loginErrorMsg: string;
  success: boolean;

  // tslint:disable-next-line: max-line-length
  constructor(public formBuilder: FormBuilder, public userService: UserService, public navCtrl: NavController) {}

  /**
   * ngOnInit()
   */
  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      email: ['', Validators.compose([Validators.required, Validators.email])],
      password: ['', Validators.compose([Validators.required, Validators.minLength(6)])]
    });
  }

  /**
   * ionViewWillEnter
   */
  ionViewWillEnter(): void {}

  /**
   * Go to the password page
   */
  goToForgotPassword(): void {
    if (this.simpleVersion) {
      window.open(environment.homepage + 'forgot-password', '_blank');
    } else {
      this.navCtrl.navigateForward('forgot-password');
    }
  }

  /**
   * Perform the sign in
   */
  async signIn(): Promise<void> {
    if (!this.loginForm.valid) {
      this.loginErrorMsg = text.valid_email;
      return;
    }
    this.loginErrorMsg = undefined;
    this.success = await this.userService.login(this.loginForm.value, () => (this.loginErrorMsg = text.invalid_email_password));
  }

  goToSignup(): void {
    this.navCtrl.navigateForward('signup');
  }
}
