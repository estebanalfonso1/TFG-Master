import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListProfesorComponent } from './list-profesor.component';

describe('ListProfesorComponent', () => {
  let component: ListProfesorComponent;
  let fixture: ComponentFixture<ListProfesorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListProfesorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListProfesorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
