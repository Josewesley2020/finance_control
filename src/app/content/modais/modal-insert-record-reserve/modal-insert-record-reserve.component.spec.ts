import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalInsertRecordReserveComponent } from './modal-insert-record-reserve.component';

describe('ModalInsertRecordReserveComponent', () => {
  let component: ModalInsertRecordReserveComponent;
  let fixture: ComponentFixture<ModalInsertRecordReserveComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalInsertRecordReserveComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalInsertRecordReserveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
