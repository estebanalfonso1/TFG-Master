import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { jwtDecode } from 'jwt-decode';
import { TribunalService } from '../../../service/tribunal.service';
import { ValoracionService } from '../../../service/valoracion.service';
import { Valoracion } from '../../../model/Valoracion';
import { ActorService } from '../../../service/actor.service';
import { Profesor } from '../../../model/Profesor';
import { TagModule } from 'primeng/tag';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { MultiSelectModule } from 'primeng/multiselect';
import { SelectModule } from 'primeng/select';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { FormsModule } from '@angular/forms';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-form-valoracion',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, TableModule, InputTextModule, TagModule,
    SelectModule, MultiSelectModule, ButtonModule, IconFieldModule, InputIconModule, FormsModule, ToastModule],
  providers: [MessageService],
  templateUrl: './form-valoracion.component.html',
  styleUrl: './form-valoracion.component.css'
})
export class FormValoracionComponent implements OnInit {
  formPrincipal!: FormGroup;
  idTribunal!: number;
  listaValoraciones: Valoracion[] = [];
  profesor?: Profesor;
  token: string | null = sessionStorage.getItem("token");
  rol!: string;
  nombreUsuario !: any;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private tribunalService: TribunalService,
    private valoracionService: ValoracionService,
    private actorService: ActorService,
    private messageService: MessageService
  ) {
    if (this.token !== null && this.token) {
      this.nombreUsuario = jwtDecode(this.token).sub;
      this.rol = jwtDecode<{ rol: string }>(this.token).rol;
    }
  }

  ngOnInit(): void {
    this.idTribunal = Number(this.route.snapshot.paramMap.get('id'));

    this.tribunalService.getOneTribunal(this.idTribunal).subscribe(
      result => { },
      error => {
        this.router.navigateByUrl("/");
        console.log(error)
      }
    );

    this.valoracionService.getAllValoracion().subscribe(
      result => {
        this.listaValoraciones = result.filter(v => v.tribunal.id === this.idTribunal && v.profesor.username == this.nombreUsuario);

        const formGroups = this.listaValoraciones.map(valoracion =>
          this.fb.group({
            valoracion: [valoracion.valoracion || '', [
              Validators.required,
              Validators.min(valoracion.criterio.valoracionMinima),
              Validators.max(valoracion.criterio.valoracionMaxima)
            ]]
          })
        );

        this.formPrincipal = this.fb.group({
          valoraciones: this.fb.array(formGroups)
        });
      });

    this.actorService.userLogin().subscribe(
      result => this.profesor = result,
      error => { }
    );

    this.comprobarRol();
  }

  get valoracionesArray(): FormArray {
    return this.formPrincipal.get('valoraciones') as FormArray;
  }

  getFormGroup(i: number): FormGroup {
    return this.valoracionesArray.at(i) as FormGroup;
  }

  saveValoracion(i: number): void {
    const formValoracion = this.getFormGroup(i);
    const nuevaValoracion = formValoracion.value.valoracion;
    const valoracionOriginal = this.listaValoraciones[i];

    const payload: Valoracion = {
      ...valoracionOriginal,
      valoracion: nuevaValoracion
    };

    this.valoracionService.editValoracion(payload.id, payload).subscribe({
      next: () => {
        this.listaValoraciones[i].valoracion = nuevaValoracion; // actualiza visual
        this.messageService.add({
          severity: "success",
          summary: "Éxito",
          detail: "Valoración guardada correctamente",
          life: 1900
        }); formValoracion.markAsPristine();
      },
      error: err => {
        console.error(`Error al actualizar valoración ${payload.id}`, err);
        this.messageService.add({
          severity: "error",
          summary: "Error",
          detail: "No se ha podido guardar la valoración",
          life: 1900
        });
      }
    });
  }

  private comprobarRol() {
    const token = sessionStorage.getItem("token");

    if (token) {
      const decodedToken = jwtDecode<{ rol: string }>(token);
      if (decodedToken.rol !== "PROFESOR") {
        this.router.navigate(['/']);
      }
    } else {
      this.router.navigate(['/']);
    }
  }

  volver() {
    this.router.navigate(['/tribunales/asignados']);
  }

}
