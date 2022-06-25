import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoggedUserDetailComponent } from './logged-user-detail.component';

describe('LoggedUserDetailComponent', () => {
  let component: LoggedUserDetailComponent;
  let fixture: ComponentFixture<LoggedUserDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LoggedUserDetailComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LoggedUserDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
