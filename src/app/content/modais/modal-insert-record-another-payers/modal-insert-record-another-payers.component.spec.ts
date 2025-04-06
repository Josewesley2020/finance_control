import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalInsertRecordAnotherPayersComponent } from './modal-insert-record-another-payers.component';

describe('ModalInsertRecordAnotherPayersComponent', () => {
  let component: ModalInsertRecordAnotherPayersComponent;
  let fixture: ComponentFixture<ModalInsertRecordAnotherPayersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalInsertRecordAnotherPayersComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalInsertRecordAnotherPayersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
