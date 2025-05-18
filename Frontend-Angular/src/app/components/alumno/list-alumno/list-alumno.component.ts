import { Component, OnInit } from '@angular/core';
import { Alumno } from '../../../model/Alumno';
import { AlumnoService } from '../../../service/alumno.service';
import { Router, RouterLink } from '@angular/router';
import { jwtDecode } from 'jwt-decode';
import { CommonModule } from '@angular/common';
import { AvatarModule } from 'primeng/avatar';
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
import {CardModule} from 'primeng/card';

@Component({
  selector: 'app-list-alumno',
  imports: [CommonModule, AvatarModule, TableModule, InputTextModule, TagModule,
    SelectModule, MultiSelectModule, ButtonModule, IconFieldModule, InputIconModule, FormsModule, RouterLink, ToastModule, CardModule],
  providers: [MessageService],
  templateUrl: './list-alumno.component.html',
  styleUrl: './list-alumno.component.css'
})
export class ListAlumnoComponent implements OnInit {
  public alumnos: Alumno[] = [];
  searchValue: string | undefined;


  constructor(
    private alumnoService: AlumnoService,
    private router: Router,
    private messageService: MessageService
  ) { }

  ngOnInit(): void {
    this.comprobarRol();
  }

  findAllAlumnos() {
    this.alumnoService.getAllAlumno().subscribe(
      result => { this.alumnos = result; },
      error => { console.log(error) }
    );
  }

  private comprobarRol() {
    const token = sessionStorage.getItem("token");

    if (token) {
      const decodedToken = jwtDecode<{ rol: string }>(token);
      if (decodedToken.rol !== "PROFESOR") {
        this.router.navigate(['/']);
      } else {
        this.findAllAlumnos();
      }
    } else {
      this.router.navigate(['/']);
    }
  }

  aprobado(calificacion: any): boolean {
    return Number(calificacion) >= 5;
  }

  eliminar(id: number) {
    this.alumnoService.deleteAlumno(id).subscribe(
      result => {
        this.messageService.add({
          severity: "success",
          summary: "Éxito",
          detail: "Alumno eliminado correctamente",
          life: 1900
        });
        this.alumnos = this.alumnos.filter(alumno => alumno.id !== id);
      },
      error => {
        this.messageService.add({
          severity: "error",
          summary: "Error",
          detail: "No se ha podido eliminar al alumno",
          life: 1900
        });
      }
    );
  }

   getAlumnosConFilasVacias(): any[] {
    const totalFilas = 10;
    const alumnosActuales = this.alumnos || [];
    const filasVacias = totalFilas - alumnosActuales.length;

    if (filasVacias <= 0) {
      return alumnosActuales;
    }

    const vacios = Array(filasVacias).fill({
      id: null,
      nombre: '',
      apellido1: '',
      apellido2: '',
      email: '',
      curso: '',
      telefono: '',
      direccion: '',
      calificacionTotal: null
    });

    return [...alumnosActuales, ...vacios];
  }

}
