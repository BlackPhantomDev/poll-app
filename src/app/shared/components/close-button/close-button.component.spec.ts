import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { CloseButtonComponent } from './close-button.component';

describe('CloseButtonComponent', () => {
  let component: CloseButtonComponent;
  let fixture: ComponentFixture<CloseButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CloseButtonComponent],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(CloseButtonComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('renders a button when no link is given', () => {
    expect(fixture.nativeElement.querySelector('button')).toBeTruthy();
    expect(fixture.nativeElement.querySelector('a')).toBeNull();
  });

  it('renders a link when a route is given', async () => {
    fixture.componentRef.setInput('link', '/');
    await fixture.whenStable();

    expect(fixture.nativeElement.querySelector('a')).toBeTruthy();
    expect(fixture.nativeElement.querySelector('button')).toBeNull();
  });

  it('exposes the label to assistive technology', async () => {
    fixture.componentRef.setInput('label', 'Cancel');
    await fixture.whenStable();

    expect(fixture.nativeElement.querySelector('button').getAttribute('aria-label')).toBe('Cancel');
  });
});
