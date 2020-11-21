import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';
import { UserService } from 'src/app/providers/user/user.service';

@Injectable({
  providedIn: 'root'
})
export class LSUAuthService implements CanActivate {
  constructor(public router: Router, public userService: UserService) {}

  async canActivate(): Promise<boolean> {
    // User is already logged in
    if (await this.userService.mightBeLoggedIn()) {
      this.router.navigate(['brand-dashboard']);
      return false;
    } else {
      return true;
    }
  }
}
