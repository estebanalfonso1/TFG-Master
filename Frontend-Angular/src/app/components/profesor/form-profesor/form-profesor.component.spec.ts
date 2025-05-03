import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormProfesorComponent } from './form-profesor.component';

describe('FormProfesorComponent', () => {
  let component: FormProfesorComponent;
  let fixture: ComponentFixture<FormProfesorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormProfesorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormProfesorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
