import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaskUser } from './task-user';

describe('TaskUser', () => {
  let component: TaskUser;
  let fixture: ComponentFixture<TaskUser>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TaskUser],
    }).compileComponents();

    fixture = TestBed.createComponent(TaskUser);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
