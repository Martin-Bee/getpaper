import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.page.html',
  styleUrls: ['./signup.page.scss']
})
export class SignupPage implements OnInit {
  showButtons: boolean;
  constructor() {}

  ngOnInit(): void {
    this.showButtons = true;
  }

  /**
   * Show the buttons
   * @param value
   */
  getShowButtons(value: boolean): void {
    this.showButtons = value;
  }
}
