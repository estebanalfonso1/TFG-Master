import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { RubricaService } from '../../../service/rubrica.service';
import { CommonModule } from '@angular/common';
import { jwtDecode } from 'jwt-decode';
import { CriterioService } from '../../../service/criterio.service';
import { Criterio } from '../../../model/Criterio';
import { MultiSelectModule } from 'primeng/multiselect';
import { ToggleSwitch } from 'primeng/toggleswitch';
import { DatePicker } from 'primeng/datepicker';

@Component({
  selector: 'app-form-rubrica',
  imports: [ReactiveFormsModule, CommonModule, MultiSelectModule, ToggleSwitch, DatePicker],
  templateUrl: './form-rubrica.component.html',
  styleUrl: './form-rubrica.component.css'
})
export class FormRubricaComponent implements OnInit {
  formRubrica!: FormGroup;
  id!: number;
  public criterios: Criterio[] = [];
  public criteriosIncluidos: Criterio[] = [];
  isEditMode!: boolean;
  hoy = new Date();
  datosFormulario: any;

  constructor(
    private criterioService: CriterioService,
    private rubricaService: RubricaService,
    private router: Router,
    private route: ActivatedRoute,
    private fb: FormBuilder
  ) {

    this.formRubrica = this.fb.group(
      {
        descripcion: ['', [Validators.required]],
        esBorrador: [true],
        fechaPublicacion: [this.hoy],
        criterios: [[], [Validators.required]]
      });
  }

  ngOnInit(): void {
    this.isEditMode = this.router.url.includes('editar');
    this.comprobarRol();
    this.formRubrica.get("fechaPublicacion")?.disable();

    this.id = Number(this.route.snapshot.paramMap.get('id'));
    if (this.id > 0) {
      this.rubricaService.getOneRubrica(this.id).subscribe(
        result => {
          this.formRubrica.patchValue(result);
          this.datosFormulario = { ...result };
        },
        error => { console.log("Rubrica no encontrada") }
      );
    }
    this.criterioService.getAllCriterio().subscribe(
      result => { this.criterios = result; },
      error => { console.log(error) }
    );
  }

  datosModificados(): boolean {
    return JSON.stringify(this.formRubrica.value) !== JSON.stringify(this.datosFormulario);
  }

  formularioModificado(): boolean {
    return !this.datosModificados() || this.formRubrica.invalid;
  }

  save() {
    const rubrica = this.formRubrica.getRawValue();

    if (this.id > 0) {
      this.rubricaService.editRubrica(this.id, rubrica).subscribe(
        result => {
          this.datosFormulario = { ...rubrica };

          this.formRubrica.markAsPristine();
          this.formRubrica.markAsUntouched();

        },
        error => { console.log("Rubrica no actualizada") }
      );
    } else {
      this.rubricaService.saveRubrica(rubrica).subscribe(
        result => {
          this.formRubrica.reset({
            descripcion: '',
            esBorrador: true,
            fechaPublicacion: this.hoy,
            criterios: []
          });

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