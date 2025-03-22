import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalInsertReserveDestinationComponent } from './modal-insert-reserve-destination.component';

describe('ModalInsertReserveDestinationComponent', () => {
  let component: ModalInsertReserveDestinationComponent;
  let fixture: ComponentFixture<ModalInsertReserveDestinationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalInsertReserveDestinationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalInsertReserveDestinationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
