import { TestBed } from '@angular/core/testing';
import { Component } from '@angular/core';
import { SharedModule } from './shared.module';
import { TimeAgoPipe } from './pipes/time-ago.pipe';
import { TruncatePipe } from './pipes/truncate.pipe';

/** Host component that uses SharedModule's exported pipes. */
@Component({
  selector: 'app-host',
  template: `
    <p class="trunc">{{ 'hello world' | truncate: 5 }}</p>
    <p class="ago">{{ now | timeAgo }}</p>
  `,
  imports: [SharedModule],
  standalone: true,
})
class HostComponent {
  now = new Date();
}

describe('SharedModule', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [HostComponent] }).compileComponents();
  });

  it('exports its pipes so consuming components can use them', () => {
    const fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();
    const el = fixture.nativeElement as HTMLElement;
    expect(el.querySelector('.trunc')?.textContent).toBe('hello…');
    expect(el.querySelector('.ago')?.textContent).toBe('just now');
  });
});

describe('SharedModule pipes', () => {
  it('TimeAgoPipe formats relative times', () => {
    const pipe = new TimeAgoPipe();
    expect(pipe.transform(new Date())).toBe('just now');
    expect(pipe.transform(new Date(Date.now() - 5 * 60_000))).toBe('5m ago');
    expect(pipe.transform(new Date(Date.now() - 3 * 3_600_000))).toBe('3h ago');
    expect(pipe.transform(new Date(Date.now() - 2 * 86_400_000))).toBe('2d ago');
    expect(pipe.transform('')).toBe('');
  });

  it('TruncatePipe shortens long text and keeps short text intact', () => {
    const pipe = new TruncatePipe();
    expect(pipe.transform('short text', 120)).toBe('short text');
    const long = 'a'.repeat(200);
    const result = pipe.transform(long, 50);
    expect(result.length).toBe(51); // 50 chars + ellipsis
    expect(result.endsWith('…')).toBe(true);
    expect(pipe.transform(null)).toBe('');
  });
});
