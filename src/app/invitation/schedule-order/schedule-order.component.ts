import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Delivery, OptionTimeDelivery } from 'src/app/model/delivery.model';

@Component({
  selector: 'invitee-schedule-order',
  templateUrl: './schedule-order.component.html',
  styleUrls: ['./schedule-order.component.scss']
})
export class ScheduleOrderComponent implements OnInit {
  @Output() setDelivery: EventEmitter<Delivery> = new EventEmitter();
  showCalendar = false;
  minDate = this.date('min');
  maxDate = this.date('max');
  delivery: Delivery = {
    when: OptionTimeDelivery.IMMEDIATE,
    setDefault: false,
    date: this.date('now')
  };

  constructor() {}

  ngOnInit(): void {}

  /**
   * Generate a bunch of dates for our calendar
   * @param value
   */
  date(value: string): string {
    const today: Date = new Date();

    if (value && value === 'max') {
      today.setMonth(today.getMonth() + 8); // up to 8 months
    }

    if (value && value === 'now') {
      today.setDate(today.getDate() + 3); // add 3 days
    }
    if (!value || value === 'min' || value === 'max') {
      return `${today.getFullYear()}-${today.getMonth() + 1 < 10 ? '0' : ''}${today.getMonth() + 1}-${
        today.getDate() < 10 ? '0' : ''
      }${today.getDate()}`;
    }

    if (value === 'now') {
      return `${today}`;
    }
  }

  /**
   * Save Delivery Time
   */
  saveDeliveryTime(): void {
    this.setDelivery.emit(this.delivery);
  }

  /**
   * Show calender ??
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  handleDelTimeRadio(event): void {
    if (this.delivery.when === OptionTimeDelivery.CERTAINDAY) {
      this.showCalendar = true;
    } else {
      this.showCalendar = false;
    }
  }
}
