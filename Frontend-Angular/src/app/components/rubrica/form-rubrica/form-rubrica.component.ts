import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { RubricaService } from '../../../service/rubrica.service';
import { CommonModule } from '@angular/common';
import { jwtDecode } from 'jwt-decode';
import { CriterioService } from '../../../service/criterio.service';
import { Criterio } from '../../../model/Criterio';

@Component({
  selector: 'app-form-rubrica',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './form-rubrica.component.html',
  styleUrl: './form-rubrica.component.css'
})
export class FormRubricaComponent implements OnInit {
  formRubrica!: FormGroup;
  id!: number;
  public criterios: Criterio[] = [];
  public criteriosIncluidos: Criterio[] = [];



  constructor(
    private criterioService: CriterioService,
    private rubricaService: RubricaService,
    private router: Router,
    private route: ActivatedRoute,
    private fb: FormBuilder
  ) {
    const hoy = new Date();
    const fechaFormateada = `${hoy.getDate().toString().padStart(2, '0')}-${(hoy.getMonth() + 1).toString().padStart(2, '0')}-${hoy.getFullYear()}`;
    

    this.formRubrica = this.fb.group(
      {
        descripcion: ['', [Validators.required]],
        esBorrador: [true],
        fechaPublicacion: [fechaFormateada],
        criterios: [[], [Validators.required]]
      });
  }

  ngOnInit(): void {
    this.comprobarRol();
    this.formRubrica.get("fechaPublicacion")?.disable();

    this.id = Number(this.route.snapshot.paramMap.get('id'));
    if (this.id > 0) {
      this.rubricaService.getOneRubrica(this.id).subscribe(
        result => { this.formRubrica.patchValue(result) },
        error => { console.log("Rubrica no encontrada") }
      );
    }

    this.criterioService.getAllCriterio().subscribe(
      result => { this.criterios = result; },
      error => { console.log(error) }
    );

  }

  save() {
    const rubrica = this.formRubrica.getRawValue();

    if (this.id > 0) {
      this.rubricaService.editRubrica(this.id, rubrica).subscribe(
        result => {
          this.router.navigateByUrl("/rubrica");
          this.router.navigateByUrl("/");
        },
        error => { console.log("Rubrica no actualizada") }
      );
    } else {
      this.rubricaService.saveRubrica(rubrica).subscribe(
        result => {
          this.router.navigateByUrl("/rubrica")
          this.router.navigateByUrl("/");
        },
        error => { console.log("Rubrica no creada") }
      );
    }
  }

  private comprobarRol() {
    const token = sessionStorage.getItem("token");

    if (token) {
      const decodedToken = jwtDecode<{ rol: string }>(token);
      if (decodedToken.rol != "PROFESOR") {
        this.router.navigate(['/']);
      }
    } else {
      this.router.navigate(['/']);
    }
  }
}