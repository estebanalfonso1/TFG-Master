import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActorService } from '../../../service/actor.service';
import { Router, ActivatedRoute } from '@angular/router';
import { AlumnoService } from '../../../service/alumno.service';
import { jwtDecode } from 'jwt-decode';
import { AvatarModule } from 'primeng/avatar';

@Component({
  selector: 'app-form-alumno',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, AvatarModule],
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

  constructor(
    private fb: FormBuilder,
    private alumnoService: AlumnoService,
    private actorService: ActorService,
    private router: Router,
    private route: ActivatedRoute
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

  save() {
    const alumno = this.alumnoForm.value;

    this.actorService.actorExist(alumno.username).subscribe(
      exists => {
        if (exists) {
          window.alert("El nombre de usuario ya está en uso. Por favor, elige otro.");
        } else {
          if (this.isEditMode) {
            this.alumnoService.editAlumno(alumno).subscribe(
              result => {
                window.alert("Perfil actualizado correctamente");
                window.location.href = "/";
              },
              error => { console.log(error); }
            );
          } else if (this.isEditModeId) {
            this.alumnoService.editAlumnoById(this.id, alumno).subscribe(
              result => {
                window.alert("Perfil actualizado correctamente");
                window.location.href = "/";
              },
              error => { console.log(error); }
            );
          }
          else {
            this.alumnoService.saveAlumno(alumno).subscribe(
              result => {
                window.alert("Alumno creado correctamente");
                this.router.navigateByUrl("/");
              },
              error => {
                console.error("Error al crear alumno:", error);
                window.alert("Error al crear el alumno.");
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

}
