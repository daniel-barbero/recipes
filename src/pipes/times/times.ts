import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'timesPipe',
})
export class TimesPipe implements PipeTransform {

  transform(value: number): any {
    const iterable = {};
    iterable[Symbol.iterator] = function* () {
      let n = 0;
      while (n < value) {
        yield ++n;
      }
    };
    return iterable;
  }
}
