import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CriterioService } from '../../../service/criterio.service';
import { CommonModule } from '@angular/common';
import { jwtDecode } from 'jwt-decode';
import { ToggleSwitch } from 'primeng/toggleswitch';

@Component({
  selector: 'app-form-criterio',
  imports: [ReactiveFormsModule, CommonModule, ToggleSwitch],
  templateUrl: './form-criterio.component.html',
  styleUrl: './form-criterio.component.css'
})
export class FormCriterioComponent implements OnInit {
  formCriterio!: FormGroup;
  id!: number;
  isEditMode!: boolean;
  datosFormulario: any;

  constructor(
    private criterioService: CriterioService,
    private router: Router,
    private route: ActivatedRoute,
    private fb: FormBuilder
  ) {
    this.formCriterio = this.fb.group(
      {
        valoracionMaxima: ['', [Validators.min(0), Validators.max(10), this.validacionMaximaMayorQueMinima]],
        valoracionMinima: ['', [Validators.min(0), Validators.max(10), this.validacionMinimaMenorQueMaxima]],
        deTutor: [false],
        descripcion: ['', [Validators.required]]
      }, { validators: this.validacionValoraciones() }
    );
  }

  ngOnInit(): void {
    this.isEditMode = this.router.url.includes('editar');
    this.comprobarRol();
    this.id = Number(this.route.snapshot.paramMap.get('id'));
    if (this.id > 0) {
      this.criterioService.getOneCriterio(this.id).subscribe(
        result => {
          this.formCriterio.patchValue(result);
          this.datosFormulario = { ...result };

        },
        error => { console.log("Criterio no encontrado") }
      );
    }
  }

  datosModificados(): boolean {
    return JSON.stringify(this.formCriterio.value) !== JSON.stringify(this.datosFormulario);
  }

  formularioModificado(): boolean {
    return !this.datosModificados() || this.formCriterio.invalid;
  }

  save() {
    const criterio = this.formCriterio.value;

    if (this.id > 0) {
      this.criterioService.editCriterio(this.id, criterio).subscribe(
        result => {
          this.datosFormulario = { ...criterio };
        },
        error => { console.log("Criterio no actualizado") }
      );
    } else {
      this.criterioService.saveCriterio(criterio).subscribe(
        result => {
          this.formCriterio.reset({
            valoracionMaxima: '',
            valoracionMinima: '',
            deTutor: false,
            descripcion: ''
          });
        },
        error => { console.log("Criterio no creado") }
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

  volver() {
    this.router.navigate(['/criterios']);
  }

  validacionMinimaMenorQueMaxima(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const valoracionMaxima = this.formCriterio?.get('valoracionMaxima')?.value;
      const valoracionMinima = control.value;

      if (valoracionMinima > valoracionMaxima) {
        return { minimaMayorQueMaxima: true };
      }

      return null;
    };
  }

  validacionMaximaMayorQueMinima(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const valoracionMinima = this.formCriterio?.get('valoracionMinima')?.value;
      const valoracionMaxima = control.value;

      if (valoracionMaxima < valoracionMinima) {
        return { maximaMenorQueMinima: true };
      }

      return null;
    };
  }

  validacionValoraciones(): ValidatorFn {
    return (grupo: AbstractControl): ValidationErrors | null => {
      const valoracionMinima = grupo.get('valoracionMinima')?.value;
      const valoracionMaxima = grupo.get('valoracionMaxima')?.value;

      if (valoracionMinima != null && valoracionMaxima != null) {
        if (valoracionMinima > valoracionMaxima) {
          return { rangoInvalido: true };
        }
      }

      return null;
    };
  }
}