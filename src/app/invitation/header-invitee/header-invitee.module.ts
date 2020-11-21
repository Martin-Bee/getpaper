import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderInviteeComponent } from './header-invitee.component';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

@NgModule({
  declarations: [HeaderInviteeComponent],
  imports: [CommonModule, FormsModule, IonicModule, NgbModule],
  exports: [HeaderInviteeComponent]
})
export class HeaderInviteeModule {}
