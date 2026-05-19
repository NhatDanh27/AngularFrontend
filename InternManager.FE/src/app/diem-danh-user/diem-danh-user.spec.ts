import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DiemDanhUser } from './diem-danh-user';

describe('DiemDanhUser', () => {
  let component: DiemDanhUser;
  let fixture: ComponentFixture<DiemDanhUser>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DiemDanhUser],
    }).compileComponents();

    fixture = TestBed.createComponent(DiemDanhUser);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
