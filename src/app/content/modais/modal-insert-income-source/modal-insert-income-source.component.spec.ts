import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalInsertIncomeSourceComponent } from './modal-insert-income-source.component';

describe('ModalInsertIncomeSourceComponent', () => {
  let component: ModalInsertIncomeSourceComponent;
  let fixture: ComponentFixture<ModalInsertIncomeSourceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalInsertIncomeSourceComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalInsertIncomeSourceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
