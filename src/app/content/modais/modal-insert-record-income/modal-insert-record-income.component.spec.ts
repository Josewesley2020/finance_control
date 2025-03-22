import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalInsertRecordIncomeComponent } from './modal-insert-record-income.component';

describe('ModalInsertRecordIncomeComponent', () => {
  let component: ModalInsertRecordIncomeComponent;
  let fixture: ComponentFixture<ModalInsertRecordIncomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalInsertRecordIncomeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalInsertRecordIncomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
