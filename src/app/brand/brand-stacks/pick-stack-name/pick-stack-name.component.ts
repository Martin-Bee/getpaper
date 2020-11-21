import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { StacksService } from 'src/app/providers/stacks/stacks.service';
import * as text from 'src/app/resources/resource.json';

@Component({
  selector: 'pick-stack-name',
  templateUrl: './pick-stack-name.component.html',
  styleUrls: ['./pick-stack-name.component.scss']
})
export class PickStackNameComponent implements OnInit {
  @Output() setStackName: EventEmitter<string> = new EventEmitter();
  @Input() name: string;

  errorMessage: string;

  constructor(private stackService: StacksService) {}

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  ngOnInit(): void {}

  /**
   * Next()
   */
  async next(): Promise<void> {
    if (await this.stackService.exists(this.name)) {
      this.errorMessage = text.stacks_name_already_exist;
    } else {
      this.errorMessage = undefined;
      this.setStackName.emit(this.name);
    }
  }
}
