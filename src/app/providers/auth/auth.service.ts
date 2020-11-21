import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { UserService } from 'src/app/providers/user/user.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService implements CanActivate {
  constructor(public router: Router, private userService: UserService, private toastCtrl: ToastController) {}

  async canActivate(): Promise<boolean> {
    // This is a shortcut to save if the user is logged in quickly before the real auth
    // fires in with auth() event.
    if (await this.userService.mightBeLoggedIn()) {
      return true;
    } else {
      const toast = this.toastCtrl.create({
        message: 'You need to be logged in to access this page.',
        duration: 2000,
        position: 'bottom'
      });
      toast.then(t => t.present());
      this.router.navigate(['login']);
      return false;
    }
  }
}
