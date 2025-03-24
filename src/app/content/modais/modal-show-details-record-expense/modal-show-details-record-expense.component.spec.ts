import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalShowDetailsRecordExpenseComponent } from './modal-show-details-record-expense.component';

describe('ModalShowDetailsRecordExpenseComponent', () => {
  let component: ModalShowDetailsRecordExpenseComponent;
  let fixture: ComponentFixture<ModalShowDetailsRecordExpenseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalShowDetailsRecordExpenseComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalShowDetailsRecordExpenseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
