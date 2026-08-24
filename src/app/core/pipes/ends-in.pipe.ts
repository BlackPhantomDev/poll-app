import { Pipe, PipeTransform } from '@angular/core';

const DAY_IN_MS = 86_400_000;

@Pipe({ name: 'endsIn' })
export class EndsInPipe implements PipeTransform {
  /**
   * Turns an end date into the countdown a survey card shows. A survey without an
   * end date runs indefinitely; one whose date has passed reads as ended.
   */
  transform(endDate: string | null): string {
    if (endDate === null) {
      return 'No end date';
    }

    const days = Math.ceil((new Date(endDate).getTime() - Date.now()) / DAY_IN_MS);

    if (days <= 0) {
      return 'Ended';
    }

    return days === 1 ? 'Ends in 1 day' : `Ends in ${days} days`;
  }
}
