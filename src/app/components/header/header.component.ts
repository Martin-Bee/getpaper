import { Component, OnInit, Input } from '@angular/core';
import { ResizeService } from 'src/app/components/size-detector/resize.service';
import { SCREEN_SIZE } from 'src/app/components/size-detector/screen-size.enum';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  public screenSize: SCREEN_SIZE;
  @Input() buttonVisible: boolean;

  constructor(private resizeSvc: ResizeService) {
    // subscribe to the size change stream
    this.resizeSvc.onResize$.subscribe(x => {
      this.screenSize = x;
    });
    this.screenSize = this.resizeSvc.currentSize;
  }

  ngOnInit(): void {}

  openHeaderMenu(): void {
    //TODO mobile
  }
}
