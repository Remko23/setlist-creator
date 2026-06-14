import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SetlistBuilder } from './setlist-builder';

describe('SetlistBuilder', () => {
  let component: SetlistBuilder;
  let fixture: ComponentFixture<SetlistBuilder>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SetlistBuilder],
    }).compileComponents();

    fixture = TestBed.createComponent(SetlistBuilder);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
