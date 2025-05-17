import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListTribunalAlumnoComponent } from './list-tribunal-alumno.component';

describe('ListTribunalAlumnoComponent', () => {
  let component: ListTribunalAlumnoComponent;
  let fixture: ComponentFixture<ListTribunalAlumnoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListTribunalAlumnoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListTribunalAlumnoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
