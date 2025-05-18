import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActorService } from '../../../service/actor.service';
import { Router, ActivatedRoute } from '@angular/router';
import { AlumnoService } from '../../../service/alumno.service';
import { jwtDecode } from 'jwt-decode';
import { AvatarModule } from 'primeng/avatar';
import { AvatarEstadoService } from '../../../service/avatar.service';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-form-alumno',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, AvatarModule, ToastModule],
  providers: [MessageService],
  templateUrl: './form-alumno.component.html',
  styleUrls: ['./form-alumno.component.css']
})
export class FormAlumnoComponent implements OnInit {
  alumnoForm: FormGroup;
  id!: number;
  isEditMode!: boolean;
  isEditModeId!: boolean;
  imagenSeleccionada: File | null = null;
  passwordVisible: boolean = false;
  datosFormulario: any;

  constructor(
    private fb: FormBuilder,
    private alumnoService: AlumnoService,
    private actorService: ActorService,
    private router: Router,
    private route: ActivatedRoute,
    private avatarEstado: AvatarEstadoService,
    private messageService: MessageService
  ) {
    this.alumnoForm = this.fb.group({
      nombre: ['', Validators.required],
      apellido1: ['', Validators.required],
      apellido2: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      foto: [''],
      telefono: ['', [Validators.pattern('^([6789]\\d{8})?$')]],
      direccion: [''],
      curso: ['', Validators.required],
      calificacionTotal: ['', [Validators.min(0), Validators.max(10)]],
      username: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(8)]],
    });
  }

  ngOnInit(): void {
    this.isEditMode = this.router.url.endsWith('editar');
    this.isEditModeId = /\/editar\/\d+$/.test(this.router.url);
    this.comprobarRol();

    if (this.isEditMode) {
      this.actorService.userLogin().subscribe(
        result => {
          this.alumnoForm.patchValue(result);
          this.alumnoForm.get("nombre")?.disable();
          this.alumnoForm.get("apellido1")?.disable();
          this.alumnoForm.get("apellido2")?.disable();

          this.alumnoForm.get("password")?.disable();
          this.alumnoForm.get("passconfirm")?.disable();
          this.alumnoForm.get('username')?.disable();

          this.datosFormulario = { ...result };

          const letra = result.nombre.charAt(0).toUpperCase();
          this.avatarEstado.setLetra(letra);
        },
        error => {
          this.router.navigateByUrl("/");
        },
      );
    } else if (this.isEditModeId) {
      const idParam = this.route.snapshot.paramMap.get('id');
      if (idParam !== null) {
        const id = +idParam;
        this.id = id;

        this.alumnoService.getOneAlumno(id).subscribe(
          alumno => {
            this.alumnoForm.patchValue(alumno);
            this.alumnoForm.get("password")?.disable();
            this.alumnoForm.get("passconfirm")?.disable();
            this.alumnoForm.get('username')?.disable();

          },
          error => {
            this.router.navigateByUrl("/");
          }
        );
      }
    }
  }

  datosModificados(): boolean {
    return JSON.stringify(this.alumnoForm.value) !== JSON.stringify(this.datosFormulario);
  }

  formularioModificado(): boolean {
    return !this.datosModificados() || this.alumnoForm.invalid;
  }

  save() {
    const alumno = this.alumnoForm.value;

    this.actorService.actorExist(alumno.username).subscribe(
      exists => {
        if (exists) {
          this.messageService.add({
            severity: "error",
            summary: "Error",
            detail: "El nombre de usuario ya está en uso. Por favor, elige otro.",
            life: 1900
          })
        } else {
          if (this.isEditMode) {
            this.alumnoService.editAlumno(alumno).subscribe(
              result => {

                this.messageService.add({
                  severity: "success",
                  summary: "Éxito",
                  detail: "Perfil actualizado correctamente",
                  life: 1900
                })

                this.datosFormulario = { ...alumno };
              },
              error => { console.log(error); }
            );
          } else if (this.isEditModeId) {
            this.alumnoService.editAlumnoById(this.id, alumno).subscribe(
              result => {
                this.messageService.add({
                  severity: "success",
                  summary: "Éxito",
                  detail: "Alumno actualizado correctamente",
                  life: 1900
                })
                this.datosFormulario = { ...alumno };
              },
              error => { console.log(error); }
            );
          }
          else {
            this.alumnoService.saveAlumno(alumno).subscribe(
              result => {
                this.messageService.add({
                  severity: "success",
                  summary: "Éxito",
                  detail: "Alumno creado correctamente",
                  life: 1900
                })
                this.router.navigateByUrl("/alumno/registro");
              },
              error => {
                this.messageService.add({
                  severity: "error",
                  summary: "Error",
                  detail: "No se ha podido crear el alumno",
                  life: 1900
                })
              }
            );
          }
        }
      },
      error => {
        console.error("Error al verificar existencia de usuario:", error);
      }
    );
  }

  private comprobarRol() {
    const token = sessionStorage.getItem("token");

    if (token) {
      const decodedToken = jwtDecode<{ rol: string }>(token);
      if (decodedToken.rol !== "PROFESOR" && !this.isEditMode) {
        this.router.navigate(['/']);
      } else if (decodedToken.rol !== "ALUMNO" && this.isEditMode) {
        this.router.navigate(['/']);
      }
    } else {
      this.router.navigate(['/']);
    }
  }

  togglePassword() {
    this.passwordVisible = !this.passwordVisible;
  }

  onImageSelected(event: any): void {
    const file = event.target.files[0]; // Obtiene el primer archivo
    if (file) {
      this.imagenSeleccionada = file;
      console.log('Imagen seleccionada:', file);
    }
  }

  uploadImage(): void {
    if (this.imagenSeleccionada) {
      // Aquí puedes manejar la carga de la imagen, por ejemplo, enviarla a un servidor
      console.log('Subiendo imagen...', this.imagenSeleccionada);
    } else {
      console.log('No se ha seleccionado ninguna imagen.');
    }
  }

  volver() {
      this.router.navigate(['/alumnos']);
  }

}
