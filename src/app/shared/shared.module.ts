import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TimeAgoPipe } from './pipes/time-ago.pipe';
import { TruncatePipe } from './pipes/truncate.pipe';

/**
 * NgModule that bundles reusable pipes so any component can import them once:
 * `imports: [SharedModule]`. The pipes themselves are standalone, so the module
 * imports and re-exports them. Kept as a classic NgModule to demonstrate the
 * module layer and support the "unit test a module" deliverable.
 */
@NgModule({
  imports: [CommonModule, TimeAgoPipe, TruncatePipe],
  exports: [TimeAgoPipe, TruncatePipe],
})
export class SharedModule {}

