import { Component, OnInit, Input } from '@angular/core';
import { PopoverController } from '@ionic/angular';
import { AccountMenuInfoComponent } from 'src/app/components/account-menu-info/account-menu-info.component';
import { UserService } from 'src/app/providers/user/user.service';

@Component({
  selector: 'app-option-menu',
  templateUrl: './option-menu.component.html',
  styleUrls: ['./option-menu.component.scss']
})
export class OptionMenuComponent implements OnInit {
  // Input infos
  @Input() title: string;
  @Input() subTitle: string;

  constructor(public popoverController: PopoverController, private userService: UserService) {}

  ngOnInit(): void {}

  /**
   * Clicked on account information
   */
  async accountInfo(): Promise<void> {
    const popover = await this.popoverController.create({
      component: AccountMenuInfoComponent,
      event,
      translucent: true
    });
    AccountMenuInfoComponent.userService = this.userService;
    return popover.present();
  }

  search(): void {}
  moreSettings(): void {}
}
