import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BranchCardComponent } from './branch-card.component';

describe('BranchCardComponent', () => {
  let component: BranchCardComponent;
  let fixture: ComponentFixture<BranchCardComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BranchCardComponent]
    });
    fixture = TestBed.createComponent(BranchCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
