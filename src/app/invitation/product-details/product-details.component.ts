import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'invitee-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.scss']
})
export class ProductDetailsComponent implements OnInit {
  @Input() images: string[];
  @Input() description: string;

  constructor() {}

  ngOnInit(): void {}
}
