import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { FooterComponent } from './footer.component';

describe('FooterComponent', () => {
  let component: FooterComponent;
  let fixture: ComponentFixture<FooterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FooterComponent],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(FooterComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('links to the legal notice', () => {
    const link: HTMLAnchorElement = fixture.nativeElement.querySelector('.footer__link');

    expect(link.getAttribute('href')).toBe('/imprint');
  });

  it('switches to the dark variant on request', async () => {
    fixture.componentRef.setInput('variant', 'dark');
    await fixture.whenStable();

    expect(fixture.nativeElement.querySelector('.footer--dark')).toBeTruthy();
  });
});
