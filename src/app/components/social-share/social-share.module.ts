import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SocialShareComponent } from './social-share.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { FormsModule } from '@angular/forms';
import { HttpClientModule, HttpClientJsonpModule } from '@angular/common/http';
import { ShareButtonsModule } from 'ngx-sharebuttons/buttons';

@NgModule({
  declarations: [SocialShareComponent],
  imports: [CommonModule, FormsModule, FontAwesomeModule, ShareButtonsModule, HttpClientModule, HttpClientJsonpModule],
  exports: [SocialShareComponent],
})
export class SocialShareModule {}
