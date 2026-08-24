import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { HeaderComponent } from './header.component';

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HeaderComponent],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('sends the logo back to the overview', () => {
    const logo: HTMLAnchorElement = fixture.nativeElement.querySelector('.header__logo');

    expect(logo.getAttribute('href')).toBe('/');
  });

  it('stays light unless the dark variant is asked for', () => {
    expect(fixture.nativeElement.querySelector('.header--dark')).toBeNull();
  });

  it('switches to the dark variant on request', async () => {
    fixture.componentRef.setInput('variant', 'dark');
    await fixture.whenStable();

    expect(fixture.nativeElement.querySelector('.header--dark')).toBeTruthy();
  });
});
