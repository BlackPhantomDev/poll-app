import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'optionLetter' })
export class OptionLetterPipe implements PipeTransform {
  /** Maps a zero-based index to its answer letter (0 → A). */
  transform(index: number): string {
    return String.fromCharCode(65 + index);
  }
}
