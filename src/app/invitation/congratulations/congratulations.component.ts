import { Component, OnInit, Input } from '@angular/core';
import { OrderOverview } from 'src/app/model/order-overview.model';
import { buildShareLink } from 'src/app/utils/share-invitation-link';

@Component({
  selector: 'invitee-congratulations',
  templateUrl: './congratulations.component.html',
  styleUrls: ['./congratulations.component.scss']
})
export class CongratulationsComponent implements OnInit {
  invitationSent: boolean;
  @Input() overview: OrderOverview;
  shareLink: string;

  constructor() {}

  ngOnInit(): void {
    this.shareLink = buildShareLink(this.overview.stackName);
  }
}
