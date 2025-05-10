import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActorService } from '../../../service/actor.service';
import { Router } from '@angular/router';
import { ProfesorService } from '../../../service/profesor.service';
import { jwtDecode } from 'jwt-decode';
import { AvatarModule } from 'primeng/avatar';

@Component({
  selector: 'app-form-profesor',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, AvatarModule],
  templateUrl: './form-profesor.component.html',
  styleUrls: ['./form-profesor.component.css']
})
export class FormProfesorComponent implements OnInit {
  profesorForm: FormGroup;
  id!: number;
  isEditMode!: boolean;
  imagenSeleccionada: File | null = null;
  passwordVisible: boolean = false;


  constructor(
    private fb: FormBuilder,
    private profesorService: ProfesorService,
    private actorService: ActorService,
    private router: Router,
  ) {
    this.profesorForm = this.fb.group({
      nombre: ['', Validators.required],
      apellido1: ['', Validators.required],
      apellido2: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      foto: [''],
      telefono: ['', [Validators.pattern('^([6789]\\d{8})?$')]],
      direccion: [''],
      username: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(8)]],
    });
  }

  ngOnInit(): void {
    this.isEditMode = this.router.url.includes('editar');
    this.comprobarRol();

    if (this.isEditMode) {
      this.actorService.userLogin().subscribe(
        result => {
          this.profesorForm.patchValue(result);
          this.profesorForm.get("password")?.disable();
          this.profesorForm.get('username')?.disable();
        },
        error => {
          this.router.navigateByUrl("/");
        },
      );
    }
  }

  save() {
    const profesor = this.profesorForm.value;

    this.actorService.actorExist(profesor.username).subscribe(
      exists => {
        if (exists) {
          window.alert("El nombre de usuario ya está en uso. Por favor, elige otro.");
        } else {
          if (this.isEditMode) {
            this.profesorService.editProfesor(profesor).subscribe(
              result => {
                window.alert("Perfil actualizado correctamente");
                this.router.navigateByUrl("/");
              },
              error => { console.log(error); }
            );
          } else {
            this.profesorService.saveProfesor(profesor).subscribe(
              result => {
                window.alert("Profesor creado correctamente");
                this.router.navigateByUrl("/");
              },
              error => {
                console.error("Error al crear profesor:", error);
                window.alert("Error al crear el profesor.");
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
      if (!this.isEditMode && decodedToken.rol !== "ADMINISTRADOR") {
        this.router.navigate(['/']);
      } else if (this.isEditMode && decodedToken.rol !== "PROFESOR") {
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
