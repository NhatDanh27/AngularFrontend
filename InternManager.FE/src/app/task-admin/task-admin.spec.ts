import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaskAdmin } from './task-admin';

describe('TaskAdmin', () => {
  let component: TaskAdmin;
  let fixture: ComponentFixture<TaskAdmin>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TaskAdmin],
    }).compileComponents();

    fixture = TestBed.createComponent(TaskAdmin);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
