import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { jwtDecode } from 'jwt-decode';
import { TribunalService } from '../../../service/tribunal.service';
import { Profesor } from '../../../model/Profesor';
import { ProfesorService } from '../../../service/profesor.service';
import { Alumno } from '../../../model/Alumno';
import { AlumnoService } from '../../../service/alumno.service';
import { Rubrica } from '../../../model/Rubrica';
import { RubricaService } from '../../../service/rubrica.service';

@Component({
  selector: 'app-form-tribunal',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './form-tribunal.component.html',
  styleUrl: './form-tribunal.component.css'
})
export class FormTribunalComponent implements OnInit {
  formTribunal!: FormGroup;
  id!: number;
  public profesores: Profesor[] = [];
  public alumnos: Alumno[] = [];
  public rubricas: Rubrica[] = [];
  isEditMode!: boolean;

  constructor(
    private tribunalService: TribunalService,
    private profesorService: ProfesorService,
    private alumnoService: AlumnoService,
    private rubricaService: RubricaService,
    private router: Router,
    private route: ActivatedRoute,
    private fb: FormBuilder
  ) {
    this.formTribunal = this.fb.group(
      {
        nombre: ['', [Validators.required]],
        fechaEntrega: [''],
        fechaFin: ['', [Validators.required]],
        estado: ['PENDIENTE', [Validators.required]],
        archivo: [''],
        tieneProfesores: [[], [Validators.required]],
        alumno: ['', [Validators.required]],
        rubrica: ['', [Validators.required]],
      });
  }

  ngOnInit(): void {
    this.isEditMode = this.router.url.includes('editar');
    this.comprobarRol();
    this.id = Number(this.route.snapshot.paramMap.get('id'));
    if (this.id > 0) {
      this.tribunalService.getOneTribunal(this.id).subscribe(
        result => { this.formTribunal.patchValue(result) },
        error => {
          console.log("Tribunal no encontrado");
          this.router.navigateByUrl("/");
        }
      );
    }

    if (!this.isEditMode) {
      this.profesorService.getAllProfesor().subscribe(
        result => { this.profesores = result; },
        error => { console.log(error) }
      );

      this.alumnoService.getAllAlumno().subscribe(
        result => { this.alumnos = result; },
        error => { console.log(error) }
      );

      this.rubricaService.getAllRubrica().subscribe(
        result => { this.rubricas = result; },
        error => { console.log(error) }
      );
    }
  }

  cancelarEntrega() {
    this.tribunalService.getOneTribunal(this.id).subscribe(
      result => {
        result.archivo = null;

        this.tribunalService.editTribunal(this.id, result).subscribe(
          resul => { },
          error => { }
        );
      },
      error => {
        console.error("Error al obtener el tribunal:", error);
      }
    );
  }

  save() {
    const tribunal = this.formTribunal.value;

    if (this.id > 0) {
      this.tribunalService.editTribunal(this.id, tribunal).subscribe(
        result => {
          this.router.navigateByUrl("/tribunal");
          this.router.navigateByUrl("/");
        },
        error => { console.log("Tribunal no actualizado") }
      );
    } else {
      this.tribunalService
        .saveTribunal(tribunal).subscribe(
          result => {
            this.router.navigateByUrl("/tribunal")
            this.router.navigateByUrl("/");
          },
          error => { console.log("Tribunal no creado") }
        );
    }
  }

  private comprobarRol() {
    const token = sessionStorage.getItem("token");

    if (token) {
      const decodedToken = jwtDecode<{ rol: string }>(token);
      if (decodedToken.rol != "PROFESOR" && !this.isEditMode) {
        this.router.navigate(['/']);
      } else if (decodedToken.rol != "ALUMNO" && this.isEditMode) {
        this.router.navigate(['/']);
      }
    } else {
      this.router.navigate(['/']);
    }
  }
}