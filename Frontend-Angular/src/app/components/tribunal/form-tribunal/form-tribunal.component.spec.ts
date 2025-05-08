import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormTribunalComponent } from './form-tribunal.component';

describe('FormTribunalComponent', () => {
  let component: FormTribunalComponent;
  let fixture: ComponentFixture<FormTribunalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormTribunalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormTribunalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
