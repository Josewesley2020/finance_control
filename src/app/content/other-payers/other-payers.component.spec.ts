import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OtherPayersComponent } from './other-payers.component';

describe('OtherPayersComponent', () => {
  let component: OtherPayersComponent;
  let fixture: ComponentFixture<OtherPayersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OtherPayersComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OtherPayersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
