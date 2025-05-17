import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormValoracionComponent } from './form-valoracion.component';

describe('FormValoracionComponent', () => {
  let component: FormValoracionComponent;
  let fixture: ComponentFixture<FormValoracionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormValoracionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormValoracionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
