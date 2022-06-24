import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserAddEditComponent } from './user-add-edit.component';

describe('UserAddEditComponent', () => {
  let component: UserAddEditComponent;
  let fixture: ComponentFixture<UserAddEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserAddEditComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserAddEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
