import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { StacksUser } from 'src/app/model/user.model';
import { UserService } from 'src/app/providers/user/user.service';
import { Address } from 'src/app/model/address.model';

@Component({
  selector: 'invitee-choose-address',
  templateUrl: './choose-address.component.html',
  styleUrls: ['./choose-address.component.scss']
})
export class ChooseAddressComponent implements OnInit {
  user: StacksUser = null;
  action: string;
  @Output() setShippingAddress: EventEmitter<Address> = new EventEmitter();

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.user = this.userService.Data;
  }

  /**
   * Add an address
   */
  addAddress(): void {
    this.action = 'add-address';
  }

  /**
   * Add an address
   * @param event the address
   */
  getAddress(event: Address): void {
    if (!this.userService.hasUser || !event) {
      this.action = '';
      return;
    }
    // Update an addres
    let addresses = this.userService.get('addresses');
    // Create a new address
    if (!addresses) {
      addresses = [];
    }
    addresses.push(event);
    this.userService.save({ addresses });
    // change panel back to normal
    this.action = '';
  }

  /**
   * Use the address
   * @param address
   */
  useAddress(address: Address): void {
    this.setShippingAddress.emit(address);
  }
}
