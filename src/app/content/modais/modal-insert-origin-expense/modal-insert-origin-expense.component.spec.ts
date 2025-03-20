import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalInsertOriginExpenseComponent } from './modal-insert-origin-expense.component';

describe('ModalInsertOriginExpenseComponent', () => {
  let component: ModalInsertOriginExpenseComponent;
  let fixture: ComponentFixture<ModalInsertOriginExpenseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalInsertOriginExpenseComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalInsertOriginExpenseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
