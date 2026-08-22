import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResultBarComponent } from './result-bar.component';

describe('ResultBarComponent', () => {
  let component: ResultBarComponent;
  let fixture: ComponentFixture<ResultBarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ResultBarComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ResultBarComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('option', {
      label: 'Option A',
      letter: 'A',
      votes: 3,
      percent: 60,
    });
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
