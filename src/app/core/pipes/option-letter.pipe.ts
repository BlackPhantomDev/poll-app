import { Pipe, PipeTransform } from '@angular/core';

/** Char code of "A"; answer letters come from the position, never from the database. */
const FIRST_LETTER = 65;

/** Maps a zero-based index to its answer letter (0 → A). */
export function optionLetter(index: number): string {
  return String.fromCharCode(FIRST_LETTER + index);
}

@Pipe({ name: 'optionLetter' })
export class OptionLetterPipe implements PipeTransform {
  /** Maps a zero-based index to its answer letter (0 → A). */
  transform(index: number): string {
    return optionLetter(index);
  }
}
