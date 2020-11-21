import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { distinctUntilChanged } from 'rxjs/operators';
import { SCREEN_SIZE } from 'src/app/components/size-detector/screen-size.enum';

@Injectable({
  providedIn: 'root'
})
export class ResizeService {
  private resizeSubject: Subject<SCREEN_SIZE>;
  private current: SCREEN_SIZE;

  /**
   * Initialize subject
   */
  constructor() {
    this.resizeSubject = new Subject();
  }

  get currentSize(): SCREEN_SIZE {
    return this.current;
  }

  /**
   * Allow this subject to receive updates
   */
  get onResize$(): Observable<SCREEN_SIZE> {
    return this.resizeSubject.asObservable().pipe(distinctUntilChanged());
  }

  /**
   * on Resize
   * @param size the size of the screen updated
   */
  onResize(size: SCREEN_SIZE): void {
    this.current = size;
    this.resizeSubject.next(size);
  }
}
