import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DisplayProductsComponent } from './display-products.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

@NgModule({
  declarations: [DisplayProductsComponent],
  imports: [ReactiveFormsModule, CommonModule, FormsModule, IonicModule, NgbModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  exports: [DisplayProductsComponent]
})
export class DisplayProductsModule {}
