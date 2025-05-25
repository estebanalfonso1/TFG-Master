import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListValoracionComponent } from './list-valoracion.component';

describe('ListValoracionComponent', () => {
  let component: ListValoracionComponent;
  let fixture: ComponentFixture<ListValoracionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListValoracionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListValoracionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
