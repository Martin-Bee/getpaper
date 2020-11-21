import { Component, ViewChild, EventEmitter, Output, OnInit, AfterViewInit, Input, ElementRef } from '@angular/core';
import { Address } from 'src/app/model/address.model';
import {} from 'google-maps';
import * as text from 'src/app/resources/resource.json';

/**
 * Get a porper formated address
 * @param addressComponents the address components
 */
function getAddressFromMatchedTypes(address: google.maps.places.PlaceResult): Address {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let streetNumber: string, street: string, neighborhood: string, city: string, state: string, county, zip: string, country: string;
  // Loop through the Geocoder result set. Note that the results
  // array will change as this loop can self iterate.
  for (const addressComponent of address.address_components) {
    const types = addressComponent.types;

    for (const type of types) {
      if (type === 'street_number') {
        streetNumber = addressComponent.long_name;
      }
      if (type === 'route') {
        street = addressComponent.long_name;
      }
      if (type === 'neighborhood') {
        neighborhood = addressComponent.long_name;
      }
      if (type === 'locality') {
        city = addressComponent.long_name;
      }
      if (type === 'administrative_area_level_1') {
        state = addressComponent.short_name;
      }
      if (type === 'administrative_area_level_2') {
        county = addressComponent.long_name;
      }
      if (type === 'postal_code') {
        zip = addressComponent.long_name;
      }
      if (type === 'postal_code_suffix') {
        zip = zip + '-' + addressComponent.long_name;
      }
      if (type === 'country') {
        country = addressComponent.long_name;
      }
      break;
    }
  }
  const geoLocation = {
    address: `${streetNumber} ${street}`,
    addressComplement: '',
    city,
    state,
    zip,
    country,
    recipient: '',
    label: '',
    display: address.formatted_address
  };
  return geoLocation;
}

@Component({
  selector: 'address-autocomplete-component',
  templateUrl: './address-autocomplete.component.html',
  styleUrls: ['./address-autocomplete.component.scss']
})
export class AddressAutocompleteComponent implements OnInit, AfterViewInit {
  @Input() addressType: string;
  @Input() addressToUpdate: Address;
  @Output() setAddress: EventEmitter<Address> = new EventEmitter();
  @ViewChild('addresstext', { read: ElementRef, static: false }) addresstext: ElementRef;

  label: string;
  recipient: string;
  autocompleteInput: string;
  queryWait: boolean;
  address: Address;
  button = '';
  hasError = false;
  displayManual = false;
  message = null;

  constructor() {}

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    Promise.resolve(null).then(() => this.updateView());
  }

  /**
   * Add manual Address
   */
  addManualAddress(): void {
    this.displayManual = true;
  }

  /**
   * update the View after init
   */
  private updateView(): void {
    this.hasError = false;

    if (!this.addressToUpdate) {
      this.button = text.save;
      this.label = '';
      this.recipient = '';
      this.autocompleteInput = '';
    } else {
      this.button = text.update;
      this.address = this.addressToUpdate;
      this.label = this.addressToUpdate.label;
      this.recipient = this.addressToUpdate.recipient;
      this.autocompleteInput = this.addressToUpdate.display;
    }
    // Had to set a slight time out otherwise the input is not available
    setTimeout(() => this.getPlaceAutocomplete(), 500);
  }

  /**
   * Initializer
   */
  private getPlaceAutocomplete(): void {
    const input = this.addresstext.nativeElement.getElementsByTagName('input')[0];
    const autocomplete = new google.maps.places.Autocomplete(input, {
      componentRestrictions: { country: ['US', 'CA'] },
      types: [this.addressType] // 'establishment' / 'address' / 'geocode'
    });
    google.maps.event.addListener(autocomplete, 'place_changed', () => {
      const place = autocomplete.getPlace();
      this.address = getAddressFromMatchedTypes(place);
    });
  }

  /**
   * Add or update the address
   */
  addOrUpdateLocation(): void {
    if (!this.address || !this.recipient) {
      this.hasError = true;
      return;
    }
    this.hasError = false;
    // check if we got the address proper

    this.setRecipientAndLabelInAddress();
    if (!this.checkAddressValidity()) {
      this.invokeEvent();
    } else {
      this.message = this.checkAddressValidity();
      this.displayManual = true;
    }
  }

  /**
   * Capitalize recipient name
   */
  capitalize(): void {
    this.recipient = this.recipient.toUpperCase();
  }

  private setRecipientAndLabelInAddress(): void {
    this.address.recipient = this.recipient;
    this.address.label = this.label || '';
  }

  /**
   * Check that the address is properly filled
   */
  private checkAddressValidity(): string {
    if (!this.address) {
      return null;
    }
    let concat = '';
    if (!this.address.city) {
      concat += 'City is missing, ';
    }
    if (!this.address.zip) {
      concat += 'Zip is missing, ';
    }
    if (!this.address.country) {
      concat += 'Country is missing, ';
    }
    if (!this.address.state) {
      concat += 'State is missing, ';
    }
    if (!this.address.address) {
      concat += 'Street is missing, ';
    }
    if (!concat) {
      return null;
    } else {
      return concat;
    }
  }

  /**
   * Manual address has been set
   * @param address the address
   */
  getManualAddress(address: Address): void {
    this.displayManual = false;
    if (!address) {
      return;
    }
    this.address = address;
    this.autocompleteInput = address.display;
  }

  /**
   * Cancel the input
   */
  cancel(): void {
    this.setAddress.emit(null);
  }

  /**
   * invoke Event
   * @param place the place result that was selected
   */
  invokeEvent(): void {
    this.setAddress.emit(this.address);
  }
}
