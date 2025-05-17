import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActorService } from '../../../service/actor.service';
import { Router } from '@angular/router';
import { ProfesorService } from '../../../service/profesor.service';
import { jwtDecode } from 'jwt-decode';
import { AvatarModule } from 'primeng/avatar';
import { AvatarEstadoService } from '../../../service/avatar.service';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-form-profesor',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, AvatarModule, ToastModule],
  providers: [MessageService],
  templateUrl: './form-profesor.component.html',
  styleUrls: ['./form-profesor.component.css']
})
export class FormProfesorComponent implements OnInit {
  profesorForm: FormGroup;
  id!: number;
  isEditMode!: boolean;
  imagenSeleccionada: File | null = null;
  passwordVisible: boolean = false;
  datosFormulario: any;

  constructor(
    private fb: FormBuilder,
    private profesorService: ProfesorService,
    private actorService: ActorService,
    private router: Router,
    private avatarEstado: AvatarEstadoService,
    private messageService: MessageService
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

          this.datosFormulario = { ...result };

          const letra = result.nombre.charAt(0).toUpperCase();
          this.avatarEstado.setLetra(letra);
        },
        error => {
          this.router.navigateByUrl("/");
        },
      );
    }
  }

  datosModificados(): boolean {
    return JSON.stringify(this.profesorForm.value) !== JSON.stringify(this.datosFormulario);
  }

  formularioModificado(): boolean {
    return !this.datosModificados() || this.profesorForm.invalid;
  }

  save() {
    const profesor = this.profesorForm.value;

    this.actorService.actorExist(profesor.username).subscribe(
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
            this.profesorService.editProfesor(profesor).subscribe(
              result => {
                const nuevaLetra = profesor.nombre.charAt(0).toUpperCase();
                this.avatarEstado.setLetra(nuevaLetra);

                this.messageService.add({
                  severity: "success",
                  summary: "Éxito",
                  detail: "Perfil actualizado correctamente",
                  life: 1900
                })

                this.datosFormulario = { ...profesor };

              },
              error => { console.log(error); }
            );
          } else {
            this.profesorService.saveProfesor(profesor).subscribe(
              result => {
                this.messageService.add({
                  severity: "success",
                  summary: "Éxito",
                  detail: "Profesor creado correctamente",
                  life: 1900
                })
                this.router.navigateByUrl("/");
              },
              error => {
                this.messageService.add({
                  severity: "error",
                  summary: "Error",
                  detail: "No se ha podido crear el profesor",
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
