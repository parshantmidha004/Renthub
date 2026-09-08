import { Pipe, PipeTransform } from '@angular/core';

/** Truncates long text to the given limit and appends an ellipsis. */
@Pipe({ name: 'truncate' })
export class TruncatePipe implements PipeTransform {
  transform(value: string | null | undefined, limit = 120, ellipsis = '…'): string {
    if (!value) {
      return '';
    }
    const text = value.trim();
    return text.length <= limit ? text : text.slice(0, limit).trimEnd() + ellipsis;
  }
}
