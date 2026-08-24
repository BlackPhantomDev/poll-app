import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { ImprintPageComponent } from './imprint-page.component';

describe('ImprintPageComponent', () => {
  let component: ImprintPageComponent;
  let fixture: ComponentFixture<ImprintPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ImprintPageComponent],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(ImprintPageComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('shows the imprint heading', () => {
    const title: HTMLHeadingElement = fixture.nativeElement.querySelector('.imprint__title');

    expect(title.textContent).toContain('Imprint');
  });
});
