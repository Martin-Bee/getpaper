import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChooseAddressComponent } from './choose-address.component';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { AddressAutocompleteModule } from 'src/app/components/address-autocomplete/address-autocomplete.module';

@NgModule({
  declarations: [ChooseAddressComponent],
  entryComponents: [],
  imports: [CommonModule, FormsModule, IonicModule, AddressAutocompleteModule],
  exports: [ChooseAddressComponent]
})
export class ChooseAddressModule {}
