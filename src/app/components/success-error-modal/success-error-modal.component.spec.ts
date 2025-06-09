import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SuccessErrorModalComponent } from './success-error-modal.component';

describe('SuccessErrorModalComponent', () => {
  let component: SuccessErrorModalComponent;
  let fixture: ComponentFixture<SuccessErrorModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SuccessErrorModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SuccessErrorModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
