import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
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
import { FormsModule } from '@angular/forms';
import { DatePicker } from 'primeng/datepicker';
import { SelectModule } from 'primeng/select';
import { MultiSelectModule } from 'primeng/multiselect';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-form-tribunal',
  imports: [ReactiveFormsModule, CommonModule, FormsModule, DatePicker, SelectModule, MultiSelectModule],
  providers: [MessageService],
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
    private messageService: MessageService,
    private fb: FormBuilder
  ) {
    this.formTribunal = this.fb.group(
      {
        fechaEntrega: [''],
        fechaFin: ['', [Validators.required, this.fechaValida()]],
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
        result => {
          this.profesores = result.map(
            profesor => ({
              ...profesor,
              nombreCompleto: `${profesor.nombre} ${profesor.apellido1} ${profesor.apellido2}`
            })
          )
        },
        error => { console.log(error) }
      );

      this.alumnoService.getAllAlumno().subscribe(
        result => {
          this.alumnos = result.map(
            alumno => ({
              ...alumno,
              nombreCompleto: `${alumno.nombre} ${alumno.apellido1} ${alumno.apellido2}`
            })
          )
        },
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
          this.messageService.add({
            severity: "success",
            summary: "Éxito",
            detail: "Tribunal actualizado correctamente",
            life: 1900
          })
          this.router.navigateByUrl("/tribunal");
          this.router.navigateByUrl("/");
        },
        error => {
          this.messageService.add({
            severity: "error",
            summary: "Error",
            detail: "No se ha podido actualizar el tribunal",
            life: 1900
          })
        }
      );
    } else {
      this.tribunalService
        .saveTribunal(tribunal).subscribe(
          result => {
            this.messageService.add({
              severity: "success",
              summary: "Éxito",
              detail: "Tribunal creado correctamente",
              life: 1900
            })

            this.formTribunal.reset({
              fechaEntrega: '',
              fechaFin: '',
              estado: 'PENDIENTE',
              archivo: '',
              tieneProfesores: [],
              alumno: '',
              rubrica: '',
            });

          },
          error => {
            this.messageService.add({
              severity: "error",
              summary: "Error",
              detail: "No se ha podido crear el tribunal",
              life: 1900
            })
          }
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

  fechaValida(): ValidatorFn {
      return (control: AbstractControl): ValidationErrors | null => {
        const fechaFin = this.formTribunal?.get('fechaFin')?.value;
        const fechaHoy = new Date();
  
        if (fechaHoy > fechaFin) {
          return { fechaNoValida: true };
        }
  
        return null;
      };
    }
}