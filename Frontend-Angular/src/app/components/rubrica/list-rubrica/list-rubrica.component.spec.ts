import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListRubricaComponent } from './list-rubrica.component';

describe('ListRubricaComponent', () => {
  let component: ListRubricaComponent;
  let fixture: ComponentFixture<ListRubricaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListRubricaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListRubricaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
