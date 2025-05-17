import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListTribunalProfesorComponent } from './list-tribunal-profesor.component';

describe('ListTribunalProfesorComponent', () => {
  let component: ListTribunalProfesorComponent;
  let fixture: ComponentFixture<ListTribunalProfesorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListTribunalProfesorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListTribunalProfesorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
