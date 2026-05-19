import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LayoutAdmin } from './layout-admin';

describe('LayoutAdmin', () => {
  let component: LayoutAdmin;
  let fixture: ComponentFixture<LayoutAdmin>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LayoutAdmin],
    }).compileComponents();

    fixture = TestBed.createComponent(LayoutAdmin);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
