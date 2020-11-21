import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'oneSize'
})
export class OneSizePipe implements PipeTransform {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  transform(value: string, ...args: string[]): string {
    // console.log('PIPE => ', value);
    let modValue = '';
    if (value === 'Default Title') {
      modValue = 'O/S';
    } else {
      modValue = value;
    }
    return modValue;
  }
}
