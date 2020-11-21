import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Platform } from '@ionic/angular';
import { OrderOverview } from 'src/app/model/order-overview.model';

@Component({
  selector: 'header-invitee',
  templateUrl: './header-invitee.component.html',
  styleUrls: ['./header-invitee.component.scss']
})
export class HeaderInviteeComponent implements OnInit {
  @Input() showOverlay: boolean;
  @Input() stackName: string;
  @Input() overview: OrderOverview;
  @Output() setSearchQuery: EventEmitter<string> = new EventEmitter();
  @Output() goNext: EventEmitter<void> = new EventEmitter();
  @Output() goViewDetails: EventEmitter<void> = new EventEmitter();
  delayTimer;

  constructor(public plt: Platform) {}

  ngOnInit(): void {}

  // TODO implement the Go Home
  goHome(): void {}

  /**
   * Search function
   * @param event
   */
  search(event): void {
    this.setSearchQuery.emit(event.target.value);
  }

  /**
   * Click on view details
   */
  viewDetails(): void {
    this.goViewDetails.emit();
  }

  /**
   * Next function
   */
  next(): void {
    this.goNext.emit();
  }
}
