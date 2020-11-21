import { Component, OnInit } from '@angular/core';
import { PopoverController, NavParams } from '@ionic/angular';

@Component({
  selector: 'app-get-product-quantity',
  templateUrl: './get-product-quantity.component.html',
  styleUrls: ['./get-product-quantity.component.scss']
})
export class GetProductQuantityComponent implements OnInit {
  quantity = 1;
  size = '';
  constructor(public popoverCtrl: PopoverController, public navParams: NavParams) {}

  ngOnInit(): void {
    this.size = this.navParams.get('size');
  }

  close(noData?): void {
    let quantity = 0;
    if (noData) {
      quantity = 0;
    } else {
      quantity = this.quantity;
    }
    this.popoverCtrl.dismiss({ quantity });
  }
}
