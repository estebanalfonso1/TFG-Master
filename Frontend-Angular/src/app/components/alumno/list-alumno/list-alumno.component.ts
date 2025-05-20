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
import { SupabaseService } from '../../../service/supabaseAvatar.service';

@Component({
  selector: 'app-list-alumno',
  imports: [CommonModule, AvatarModule, TableModule, InputTextModule, TagModule,
    SelectModule, MultiSelectModule, ButtonModule, IconFieldModule, InputIconModule, FormsModule, RouterLink, ToastModule],
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
    private messageService: MessageService,
    private supabaseService: SupabaseService
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

  async eliminar(id: number) {
    try {
      const alumno = await this.alumnoService.getOneAlumno(id).toPromise();

      await this.alumnoService.deleteAlumno(id).toPromise();

      if (alumno?.foto) {
        const match = alumno.foto.match(/\/avatares\/(.+)$/);
        if (match?.[1]) {
          await this.supabaseService.deleteImage(match[1]);
        }
      }

      this.messageService.add({
        severity: "success",
        summary: "Éxito",
        detail: "Alumno eliminado correctamente",
        life: 1900
      });

      this.alumnos = this.alumnos.filter(a => a.id !== id);

    } catch (error) {
      this.messageService.add({
        severity: "error",
        summary: "Error",
        detail: "El alumno tiene un tribunal asignado",
        life: 1900
      });
    }
  }

}
