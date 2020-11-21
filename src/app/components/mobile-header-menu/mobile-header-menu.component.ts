import { Component, OnInit } from '@angular/core';
import { PopoverController } from '@ionic/angular';

@Component({
  selector: 'app-mobile-header-menu',
  templateUrl: './mobile-header-menu.component.html',
  styleUrls: ['./mobile-header-menu.component.scss']
})
export class MobileHeaderMenuComponent implements OnInit {
  constructor(public popoverCtrl: PopoverController) {}

  ngOnInit(): void {}

  /**
   * openThis()
   * @param page the page to open
   */
  openThis(page: string): void {
    this.popoverCtrl.dismiss(page);
  }
}
