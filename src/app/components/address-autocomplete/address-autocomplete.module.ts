import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { AddressAutocompleteComponent } from './address-autocomplete.component';
import { AddressInputComponent } from '../address-input/address-input.component';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [AddressAutocompleteComponent, AddressInputComponent],
  imports: [CommonModule, IonicModule, FormsModule],
  exports: [AddressAutocompleteComponent]
})
export class AddressAutocompleteModule {}
