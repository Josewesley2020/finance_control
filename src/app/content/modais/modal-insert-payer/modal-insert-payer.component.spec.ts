import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalInsertPayerComponent } from './modal-insert-payer.component';

describe('ModalInsertPayerComponent', () => {
  let component: ModalInsertPayerComponent;
  let fixture: ComponentFixture<ModalInsertPayerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalInsertPayerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalInsertPayerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
