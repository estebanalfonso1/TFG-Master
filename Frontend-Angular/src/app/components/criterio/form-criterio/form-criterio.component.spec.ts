import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormCriterioComponent } from './form-criterio.component';

describe('FormCriterioComponent', () => {
  let component: FormCriterioComponent;
  let fixture: ComponentFixture<FormCriterioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormCriterioComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormCriterioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
