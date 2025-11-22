import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuthPopupComponent } from './auth-popup.component';

describe('AuthPopupComponent', () => {
  let component: AuthPopupComponent;
  let fixture: ComponentFixture<AuthPopupComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AuthPopupComponent]
    });
    fixture = TestBed.createComponent(AuthPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
