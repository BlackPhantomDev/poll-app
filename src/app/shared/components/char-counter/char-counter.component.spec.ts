import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CharCounterComponent } from './char-counter.component';

describe('CharCounterComponent', () => {
  let component: CharCounterComponent;
  let fixture: ComponentFixture<CharCounterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CharCounterComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CharCounterComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('value', '');
    fixture.componentRef.setInput('max', 200);
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('counts the characters of the current value', async () => {
    fixture.componentRef.setInput('value', 'Team lunch');
    await fixture.whenStable();

    expect(fixture.nativeElement.textContent).toContain('10 / 200');
  });

  it('stays out of the accessibility tree', () => {
    expect(fixture.nativeElement.getAttribute('aria-hidden')).toBe('true');
  });

  it('marks itself once the limit is reached', async () => {
    fixture.componentRef.setInput('max', 5);
    fixture.componentRef.setInput('value', 'Lunch');
    await fixture.whenStable();

    expect(fixture.nativeElement.classList).toContain('char-counter--full');
  });
});
