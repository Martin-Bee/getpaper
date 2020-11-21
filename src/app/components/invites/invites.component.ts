import { Component, OnInit, Input, QueryList, ViewChildren } from '@angular/core';
import { FireDataService } from 'src/app/providers/fire-data/fire-data.service';
import { UserService } from 'src/app/providers/user/user.service';
import { StacksService } from 'src/app/providers/stacks/stacks.service';
import { OrganizedStacks } from 'src/app/model/product-organized';
import * as text from 'src/app/resources/resource.json';
import { emailIsValid } from 'src/app/utils/email';
import { IonInput } from '@ionic/angular';

@Component({
  selector: 'invites',
  templateUrl: './invites.component.html',
  styleUrls: ['./invites.component.scss']
})
export class InvitesComponent implements OnInit {
  @ViewChildren('input') inputs: QueryList<IonInput>;
  @Input() stack: OrganizedStacks;
  @Input() stackName: string;
  listEmailsInvitation: Array<{ num: number; email: string }> = [{ num: 1, email: '' }];
  verifyUsersBeforeStoreAccess = false;
  invitedUsersNum = 0;
  errorMessage: string;

  constructor(private fireData: FireDataService, private userService: UserService, private stacksService: StacksService) {}

  ngOnInit(): void {}

  /**
   * Click on adding user input
   */
  addUserEmailInput(): void {
    const email = this.listEmailsInvitation[this.listEmailsInvitation.length - 1].email;
    if (!email || !emailIsValid(email)) {
      this.errorMessage = text.valid_email_only;
      return;
    }
    this.errorMessage = undefined;
    let existingUserLength = this.listEmailsInvitation.length + 1;
    const plusOne = existingUserLength++;
    this.listEmailsInvitation.push({ num: plusOne, email: '' });
    setTimeout(this.setFocus, 200);
  }

  /**
   * Set the focus on last element
   */
  setFocus = (): void => {
    const inputs = this.inputs.map(item => item);
    if (inputs.length === this.listEmailsInvitation.length) {
      // set Focus on the new elements
      inputs[inputs.length - 1].setFocus();
    }
  };

  /**
   * Press enter to add a new email
   */
  nextEmail(): void {
    this.addUserEmailInput();
  }

  /**
   * inviteUsers
   */
  async inviteUsers(): Promise<void> {
    this.invitedUsersNum = this.listEmailsInvitation.length;
    const emails = new Set<string>();
    this.listEmailsInvitation.map(user => {
      if (emailIsValid(user.email)) {
        emails.add(user.email.toLowerCase().trim());
      }
    });

    // Stack can be null sometimes
    if (this.stack) {
      this.stackName = this.stack.name;
    }

    await this.fireData.sendInvites(this.stackName, [...emails], this.userService.get('companyName'));
    this.stack.invites = [...emails];
    if (this.stack) {
      await this.stacksService.save(this.stack);
    }
  }
}
