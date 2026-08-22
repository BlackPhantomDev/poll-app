import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { EndingSoonComponent } from './ending-soon.component';

describe('EndingSoonComponent', () => {
  let component: EndingSoonComponent;
  let fixture: ComponentFixture<EndingSoonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EndingSoonComponent],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(EndingSoonComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
