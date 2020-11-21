import { Component, OnInit, Input, AfterViewInit, EventEmitter, Output } from '@angular/core';
import { Address } from 'src/app/model/address.model';

@Component({
  selector: 'address-input',
  templateUrl: './address-input.component.html',
  styleUrls: ['./address-input.component.scss']
})
export class AddressInputComponent implements OnInit, AfterViewInit {
  @Input() address: Address;
  @Input() message: string;
  @Output() setManualAddress: EventEmitter<Address> = new EventEmitter();

  // Our fields
  address1: string;
  address2: string;
  city: string;
  state: string;
  country: string;
  zip: string;

  constructor() {}

  ngOnInit(): void {}

  /**
   * Capitalize recipient name
   */
  capitalize(): void {
    this.country = this.country.toUpperCase();
    this.state = this.state.toUpperCase();
    // this.city = this.city.replace(/^\w/, c => c.toUpperCase());
    this.city = this.city.replace(/(^|\s)([a-z])/g, (m, p1, p2) => p1 + p2.toUpperCase());
  }

  ngAfterViewInit(): void {
    Promise.resolve(null).then(() => this.updateView());
  }

  /**
   * Update the view
   */
  updateView(): void {
    if (!this.address) {
      return;
    }

    this.address1 = this.address.address;
    this.address2 = this.address.addressComplement;
    this.city = this.address.city;
    this.country = this.address.country;
    this.zip = this.address.zip;
    this.state = this.address.state;
  }

  /**
   * Cancel the input
   */
  cancel(): void {
    this.setManualAddress.emit(null);
  }

  /**
   * Save()
   */
  save(): void {
    if (!this.address1 || !this.city || !this.country || !this.zip || !this.state) {
      this.message = 'Fill in the required fields';
      return;
    }

    const address = {
      address: this.address1,
      addressComplement: this.address2,
      city: this.city,
      country: this.country,
      zip: this.zip,
      state: this.state,
      display: this.createDisplayName(),
      recipient: ''
    };

    this.setManualAddress.emit(address);
  }

  private createDisplayName(): string {
    const addr2 = this.address2 ? ', ' + this.address2 : '';
    return `${this.address1}${addr2}, ${this.city} ${this.zip}, ${this.state}, ${this.country}`;
  }
}
