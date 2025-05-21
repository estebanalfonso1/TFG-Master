import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListCriterioComponent } from './list-criterio.component';

describe('ListCriterioComponent', () => {
  let component: ListCriterioComponent;
  let fixture: ComponentFixture<ListCriterioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListCriterioComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListCriterioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
