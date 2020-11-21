import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OptionMenuComponent } from './option-menu.component';
import { IonicModule } from '@ionic/angular';

@NgModule({
  imports: [CommonModule, IonicModule],
  declarations: [OptionMenuComponent],
  exports: [OptionMenuComponent]
})
export class OptionMenuModule {}
