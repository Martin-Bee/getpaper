import { Component, AfterViewInit, HostListener, ElementRef } from '@angular/core';
import { SCREEN_SIZE } from './screen-size.enum';
import { ResizeService } from 'src/app/components/size-detector/resize.service';

@Component({
  selector: 'app-size-detector',
  templateUrl: './size-detector.component.html',
  styleUrls: ['./size-detector.component.scss']
})
export class SizeDetectorComponent implements AfterViewInit {
  prefix = 'is-';
  sizes = [
    {
      id: SCREEN_SIZE.XS,
      name: 'xs',
      css: `d-block d-sm-none`
    },
    {
      id: SCREEN_SIZE.SM,
      name: 'sm',
      css: `d-none d-sm-block d-md-none`
    },
    {
      id: SCREEN_SIZE.MD,
      name: 'md',
      css: `d-none d-md-block d-lg-none`
    },
    {
      id: SCREEN_SIZE.LG,
      name: 'lg',
      css: `d-none d-lg-block d-xl-none`
    },
    {
      id: SCREEN_SIZE.XL,
      name: 'xl',
      css: `d-none d-xl-block`
    }
  ];

  constructor(private elementRef: ElementRef, private resizeSvc: ResizeService) {}

  @HostListener('window:resize', [])
  private onResize(): void {
    this.detectScreenSize();
  }

  ngAfterViewInit(): void {
    this.detectScreenSize();
  }

  private detectScreenSize(): void {
    const currentSize = this.sizes.find(x => {
      // get the HTML element
      const el = this.elementRef.nativeElement.querySelector(`.${this.prefix}${x.id}`);

      // check its display property value
      const isVisible = window.getComputedStyle(el).display !== 'none';

      return isVisible;
    });

    this.resizeSvc.onResize(currentSize.id);
  }
}
