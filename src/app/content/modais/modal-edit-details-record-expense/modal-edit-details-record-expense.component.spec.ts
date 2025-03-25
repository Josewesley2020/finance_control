import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalEditDetailsRecordExpenseComponent } from './modal-edit-details-record-expense.component';

describe('ModalEditDetailsRecordExpenseComponent', () => {
  let component: ModalEditDetailsRecordExpenseComponent;
  let fixture: ComponentFixture<ModalEditDetailsRecordExpenseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalEditDetailsRecordExpenseComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalEditDetailsRecordExpenseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
