import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DiemDanhAdmin } from './diem-danh-admin';

describe('DiemDanhAdmin', () => {
  let component: DiemDanhAdmin;
  let fixture: ComponentFixture<DiemDanhAdmin>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DiemDanhAdmin],
    }).compileComponents();

    fixture = TestBed.createComponent(DiemDanhAdmin);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
