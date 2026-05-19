import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LayoutUser } from './layout-user';

describe('LayoutUser', () => {
  let component: LayoutUser;
  let fixture: ComponentFixture<LayoutUser>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LayoutUser],
    }).compileComponents();

    fixture = TestBed.createComponent(LayoutUser);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
