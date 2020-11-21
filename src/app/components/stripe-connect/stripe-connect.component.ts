import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';
import { UserService } from 'src/app/providers/user/user.service';

enum Status {
  UNDEFINED = 'undefined',
  NOT_SET = 'not_set',
  SET = 'set',
  EROOR = 'error'
}

@Component({
  selector: 'stripe-connect',
  templateUrl: './stripe-connect.component.html',
  styleUrls: ['./stripe-connect.component.scss']
})
export class StripeConnectComponent implements OnInit {
  status: Status = Status.UNDEFINED;
  windowIsOpen = false;
  installationUrl: string;

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.status = Status.NOT_SET;
    if (this.userService.get('stripeConnect')) {
      const stripe = this.userService.get('stripeConnect');
      if (stripe.access_token !== '' && stripe.access_token !== 'error') {
        this.status = Status.SET;
      } else {
        this.status = Status.EROOR;
      }
    }
  }

  /**
   * Click on connect
   */
  connect(): void {
    const clientId = environment.stripeConnectClientID;
    const state = this.userService.get('uid');
    this.installationUrl = `https://connect.stripe.com/oauth/authorize?response_type=code&client_id=${clientId}&scope=read_write&state=${state}`;
    window.open(this.installationUrl, '_blank');
    this.windowIsOpen = true;
  }
}
