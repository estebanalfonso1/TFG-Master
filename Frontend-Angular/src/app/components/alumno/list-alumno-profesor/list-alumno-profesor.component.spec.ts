import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListAlumnoProfesorComponent } from './list-alumno-profesor.component';

describe('ListAlumnoProfesorComponent', () => {
  let component: ListAlumnoProfesorComponent;
  let fixture: ComponentFixture<ListAlumnoProfesorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListAlumnoProfesorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListAlumnoProfesorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
