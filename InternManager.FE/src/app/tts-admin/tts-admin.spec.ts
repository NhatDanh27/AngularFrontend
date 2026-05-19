import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TtsAdmin } from './tts-admin';

describe('TtsAdmin', () => {
  let component: TtsAdmin;
  let fixture: ComponentFixture<TtsAdmin>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TtsAdmin],
    }).compileComponents();

    fixture = TestBed.createComponent(TtsAdmin);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
