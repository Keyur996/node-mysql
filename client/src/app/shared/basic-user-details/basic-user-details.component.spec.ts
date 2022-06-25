import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BasicUserDetailsComponent } from './basic-user-details.component';

describe('BasicUserDetailsComponent', () => {
  let component: BasicUserDetailsComponent;
  let fixture: ComponentFixture<BasicUserDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BasicUserDetailsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BasicUserDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
