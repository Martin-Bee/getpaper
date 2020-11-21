import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CongratulationsComponent } from './congratulations.component';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { SocialShareModule } from 'src/app/components/social-share/social-share.module';
import { InvitesModule } from 'src/app/components/invites/invites.module';

@NgModule({
  declarations: [CongratulationsComponent],
  imports: [CommonModule, FormsModule, IonicModule, SocialShareModule, InvitesModule],
  exports: [CongratulationsComponent]
})
export class CongratulationsModule {}
