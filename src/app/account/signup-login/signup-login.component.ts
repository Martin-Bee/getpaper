import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { UserService, UserEvent } from 'src/app/providers/user/user.service';

export enum SignupLoginCompletion {
  ALREADY = 'already',
  CREATED = 'created',
  LOGGIN = 'login'
}

@Component({
  selector: 'signup-login',
  templateUrl: './signup-login.component.html',
  styleUrls: ['./signup-login.component.scss']
})
export class SignupLoginComponent implements OnInit {
  action: string;
  loading: boolean;
  @Output() done: EventEmitter<SignupLoginCompletion> = new EventEmitter();

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.loading = true;

    this.userService.on(UserEvent.USER_INFO_AVAILABLE, () => {
      this.done.emit(SignupLoginCompletion.LOGGIN);
    });

    // This event is probably send twice
    // this.userService.onCreated(() => {
    //  this.done.emit(SignupLoginCompletion.CREATED);
    //});

    setTimeout(() => this.check(), 1500);
  }

  /**
   * Adds the events and check if
   */
  check(): void {
    if (this.userService.hasUser) {
      this.done.emit(SignupLoginCompletion.ALREADY);
    }
    this.loading = false;
  }

  gotoLogin(): void {
    this.action = 'login';
  }

  gotoSignup(): void {
    this.action = 'signup';
  }

  getShowButtons(): void {}
}
