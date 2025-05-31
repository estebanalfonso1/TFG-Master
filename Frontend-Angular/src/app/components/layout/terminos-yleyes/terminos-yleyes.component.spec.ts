import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TerminosYLeyesComponent } from './terminos-yleyes.component';

describe('TerminosYLeyesComponent', () => {
  let component: TerminosYLeyesComponent;
  let fixture: ComponentFixture<TerminosYLeyesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TerminosYLeyesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TerminosYLeyesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
