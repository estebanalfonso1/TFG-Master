import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormRubricaComponent } from './form-rubrica.component';

describe('FormRubricaComponent', () => {
  let component: FormRubricaComponent;
  let fixture: ComponentFixture<FormRubricaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormRubricaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormRubricaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
