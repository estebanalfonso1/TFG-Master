import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActorService } from '../../../service/actor.service';
import { Router } from '@angular/router';
import { AdministradorService } from '../../../service/administrador.service';
import { jwtDecode } from 'jwt-decode';
import { AvatarModule } from 'primeng/avatar';
import { AvatarEstadoService } from '../../../service/avatar.service';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { SupabaseServiceAvatar } from '../../../service/supabaseAvatar.service';

@Component({
  selector: 'app-form-administrador',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, AvatarModule, ToastModule],
  providers: [MessageService],
  templateUrl: './form-administrador.component.html',
  styleUrls: ['./form-administrador.component.css']
})
export class FormAdministradorComponent implements OnInit {
  administradorForm: FormGroup;
  id!: number;
  isEditMode!: boolean;
  imagenSeleccionada: File | null = null;
  passwordVisible: boolean = false;
  datosFormulario: any;

  constructor(
    private fb: FormBuilder,
    private administradorService: AdministradorService,
    private actorService: ActorService,
    private router: Router,
    private avatarEstado: AvatarEstadoService,
    private messageService: MessageService,
    private supabaseService: SupabaseServiceAvatar
  ) {
    this.administradorForm = this.fb.group({
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
          this.administradorForm.patchValue(result);
          this.administradorForm.get("password")?.disable();
          this.administradorForm.get("passconfirm")?.disable();
          this.administradorForm.get('username')?.disable();

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
    return JSON.stringify(this.administradorForm.value) !== JSON.stringify(this.datosFormulario);
  }

  formularioModificado(): boolean {
    return !this.datosModificados() || this.administradorForm.invalid;
  }

  async save() {
    const admin = this.administradorForm.value;

    if (this.imagenSeleccionada) {
      if (admin.foto) {
        const imagen = admin.foto.match(/\/avatares\/(.+)$/);

        if (imagen?.[1]) {
          await this.supabaseService.eliminarImagen(imagen[1]);
        }

      }

      const extension = this.imagenSeleccionada.name.split('.').pop();
      const nombreArchivo = `${admin.username}_${Date.now()}.${extension}`;

      const nuevaUrl = await this.supabaseService.subirImagen(this.imagenSeleccionada, nombreArchivo);

      if (nuevaUrl) {
        this.administradorForm.patchValue({ foto: nuevaUrl });

        admin.foto = nuevaUrl;

        this.avatarEstado.setFoto(nuevaUrl)

        this.administradorForm.markAsDirty();
      }
    }

    this.actorService.actorExist(admin.username).subscribe(
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
            this.administradorService.editAdministrador(admin).subscribe(
              result => {
                const nuevaLetra = admin.nombre.charAt(0).toUpperCase();
                this.avatarEstado.setLetra(nuevaLetra);

                this.messageService.add({
                  severity: "success",
                  summary: "Éxito",
                  detail: "Perfil actualizado correctamente",
                  life: 1900
                })

                this.datosFormulario = { ...admin };

              },
              error => { console.log(error); }
            );
          } else {
            this.administradorService.saveAdministrador(admin).subscribe(
              result => {
                this.messageService.add({
                  severity: "success",
                  summary: "Éxito",
                  detail: "Administrador creado correctamente",
                  life: 1900
                })
                this.router.navigateByUrl("/");
              },
              error => {
                this.messageService.add({
                  severity: "error",
                  summary: "Error",
                  detail: "No se ha podido crear el administrador",
                  life: 1900
                })
              }
            );
          }
        }
      },
      error => {
        console.log(error);
      }
    );
  }


  private comprobarRol() {
    const token = sessionStorage.getItem("token");

    if (token) {
      const decodedToken = jwtDecode<{ rol: string }>(token);
      if (decodedToken.rol != "ADMINISTRADOR") {
        this.router.navigate(['/']);
      }
    } else {
      this.router.navigate(['/']);
    }
  }

  togglePassword() {
    this.passwordVisible = !this.passwordVisible;
  }

  subirImagen(event: any): void {
    const imagen: File = event.target.files[0];

    if (imagen) {

      this.imagenSeleccionada = imagen;

      const nuevaUrl = URL.createObjectURL(imagen);
      this.administradorForm.patchValue({ foto: nuevaUrl });

      this.administradorForm.get('foto')?.markAsDirty();
      this.administradorForm.markAsDirty();

      event.target.value = '';
    }
  }

}