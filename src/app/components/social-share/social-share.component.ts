import { Component, Input } from '@angular/core';
import { FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { iconpack } from 'src/app/utils/icons';

@Component({
  selector: 'app-social-share',
  templateUrl: './social-share.component.html',
  styleUrls: ['./social-share.component.scss'],
})
export class SocialShareComponent {
  @Input() url: string;
  constructor(library: FaIconLibrary) {
    library.addIcons(...iconpack);
  }
}
