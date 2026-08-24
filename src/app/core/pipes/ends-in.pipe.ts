import { Pipe, PipeTransform } from '@angular/core';

const DAY_IN_MS = 86_400_000;

/** Formats day and month zero padded so the width stays the same across cards. */
function formatDay(date: Date): string {
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');

  return `${day}.${month}.${date.getFullYear()}`;
}

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

    const end = new Date(endDate);
    const days = Math.ceil((end.getTime() - Date.now()) / DAY_IN_MS);

    if (days <= 0) {
      return `Ended ${formatDay(end)}`;
    }

    return days === 1 ? 'Ends in 1 day' : `Ends in ${days} days`;
  }
}
