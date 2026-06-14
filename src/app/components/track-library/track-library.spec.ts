import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrackLibrary } from './track-library';

describe('TrackLibrary', () => {
  let component: TrackLibrary;
  let fixture: ComponentFixture<TrackLibrary>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TrackLibrary],
    }).compileComponents();

    fixture = TestBed.createComponent(TrackLibrary);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
