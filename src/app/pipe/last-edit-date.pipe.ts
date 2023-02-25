import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'lastEditDate',
})
export class LastEditDatePipe implements PipeTransform {
  transform(value: Date): string {
    const dateNow = new Date();
    const dateEdited = new Date(value);

    let diff = (dateNow.getTime() - dateEdited.getTime()) / 1000;

    diff /= 60;
    let roundedDate = Math.abs(Math.round(diff));

    let outputDate = '';

    if (roundedDate < 60) {
      outputDate = `Edited ${roundedDate} mins ago`;
    } else if (roundedDate < 1440) {
      diff /= 60;
      roundedDate = Math.abs(Math.round(diff));
      outputDate = `Edited ${roundedDate} hrs ago`;
    } else if (roundedDate < 2880) {
      outputDate = `Edited ${1} day ago`;
    } else {
      outputDate = `Edited some days ago`;
    }

    return outputDate;
  }
}
