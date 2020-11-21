import { Component, OnInit, Input } from '@angular/core';
import { OrganizedStacks } from 'src/app/model/product-organized';
import { OrderOverview } from 'src/app/model/order-overview.model';

@Component({
  selector: 'app-order-details',
  templateUrl: './order-details.component.html',
  styleUrls: ['./order-details.component.scss']
})
export class OrderDetailsComponent implements OnInit {
  @Input() stack: OrganizedStacks;
  @Input() overview: OrderOverview;

  constructor() {}

  ngOnInit(): void {
    console.log(this.overview);
    console.log(this.stack);
  }
}
