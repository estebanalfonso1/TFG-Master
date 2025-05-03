import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActorService } from '../../../service/actor.service';
import { Router } from '@angular/router';
import { AdministradorService } from '../../../service/administrador.service';
import { jwtDecode } from 'jwt-decode';

@Component({
  selector: 'app-form-administrador',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './form-administrador.component.html',
  styleUrls: ['./form-administrador.component.css']
})
export class FormAdministradorComponent implements OnInit {
  administradorForm: FormGroup;
  id!: number;
  passNoCoinciden: boolean = false;
  isEditMode!: boolean;

  constructor(
    private fb: FormBuilder,
    private administradorService: AdministradorService,
    private actorService: ActorService,
    private router: Router,
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
      passconfirm: ['', [Validators.required, Validators.minLength(8)]],
    }, { validator: this.comprobarContrasena });
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
        },
        error => {
          this.router.navigateByUrl("/");
        },
      );
    }
  }

  save() {
    const admin = this.administradorForm.value;

    this.actorService.actorExist(admin.username).subscribe(
      exists => {
        if (exists) {
          window.alert("El nombre de usuario ya está en uso. Por favor, elige otro.");
        } else {
          if (this.isEditMode) {
            this.administradorService.editAdministrador(admin).subscribe(
              result => {
                window.alert("Perfil actualizado correctamente");
                this.router.navigateByUrl("/");
              },
              error => { console.log(error); }
            );
          } else {
            this.administradorService.saveAdministrador(admin).subscribe(
              result => {
                window.alert("Administrador creado correctamente");
                this.router.navigateByUrl("/");
              },
              error => { console.log(error); }
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

  private comprobarContrasena(group: FormGroup) {
    const password = group.get('password')?.value;
    const confirmPassword = group.get('passconfirm')?.value;

    if (password && confirmPassword && password !== confirmPassword) {
      return { passNoCoinciden: true };
    }
    return null;
  }

}