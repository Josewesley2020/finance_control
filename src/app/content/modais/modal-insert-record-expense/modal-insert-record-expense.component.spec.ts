import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalInsertRecordExpenseComponent } from './modal-insert-record-expense.component';

describe('ModalInsertRecordExpenseComponent', () => {
  let component: ModalInsertRecordExpenseComponent;
  let fixture: ComponentFixture<ModalInsertRecordExpenseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalInsertRecordExpenseComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalInsertRecordExpenseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
