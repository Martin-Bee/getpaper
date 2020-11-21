import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UserService, UserEvent } from 'src/app/providers/user/user.service';
import { FireDataService } from 'src/app/providers/fire-data/fire-data.service';
import { StripeConnectResponse } from 'src/app/model/stripe-connect-response';

@Component({
  selector: 'app-stripe-setup',
  templateUrl: './stripe-setup.page.html',
  styleUrls: ['./stripe-setup.page.scss']
})
export class StripeSetupPage implements OnInit {
  loading = true;
  successful = false;
  errorMessage = '';

  constructor(private route: ActivatedRoute, private userService: UserService, private fireData: FireDataService) {}

  /**
   * On Init()
   */
  ngOnInit(): void {
    this.userService.on(UserEvent.USER_INFO_AVAILABLE, () => {
      this.route.queryParams.subscribe(async data => {
        if (data.code && data.state && data.state === this.userService.get('uid')) {
          const res = await this.fireData.connectStripe(data.code);
          if (res.err && !res.success) {
            this.error(res.err.raw.message);
          }
          if (res.data && res.success) {
            this.success(res);
          }
        } else {
          this.error();
        }
      });
    });
  }

  /**
   * Success
   * @param res
   */
  async success(res: StripeConnectResponse): Promise<void> {
    this.errorMessage = '';
    this.loading = false;
    this.successful = true;
    this.userService.save({ stripeConnect: res.data });
  }

  /**
   * Error happened
   * @param errorMessage
   */
  error(errorMessage?: string): void {
    this.loading = false;
    if (errorMessage) {
      this.errorMessage = errorMessage;
    } else {
      this.errorMessage = `Error with Stripe connect. Please try again.`;
    }
  }
}
