import { Component, OnInit } from '@angular/core';
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
import { SupabaseServiceAvatar } from '../../../service/supabaseAvatar.service';
import { Profesor } from '../../../model/Profesor';
import { ProfesorService } from '../../../service/profesor.service';

@Component({
  selector: 'app-list-profesor',
  imports: [CommonModule, AvatarModule, TableModule, InputTextModule, TagModule,
    SelectModule, MultiSelectModule, ButtonModule, IconFieldModule, InputIconModule, FormsModule, RouterLink, ToastModule],
  providers: [MessageService],
  templateUrl: './list-profesor.component.html',
  styleUrl: './list-profesor.component.css'
})
export class ListProfesorComponent implements OnInit {
  public profesores: Profesor[] = [];
  searchValue: string | undefined;


  constructor(
    private profesorService: ProfesorService,
    private router: Router,
    private messageService: MessageService,
    private supabaseService: SupabaseServiceAvatar
  ) { }

  ngOnInit(): void {
    this.comprobarRol();
  }

  findAllProfesores() {
    this.profesorService.getAllProfesor().subscribe(
      result => { this.profesores = result; },
      error => { console.log(error) }
    );
  }

  private comprobarRol() {
    const token = sessionStorage.getItem("token");

    if (token) {
      const decodedToken = jwtDecode<{ rol: string }>(token);
      if (decodedToken.rol !== "ADMINISTRADOR") {
        this.router.navigate(['/']);
      } else {
        this.findAllProfesores();
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
      const alumno = await this.profesorService.getOneProfesor(id).toPromise();

      await this.profesorService.deleteProfesor(id).toPromise();

      if (alumno?.foto) {
        const match = alumno.foto.match(/\/avatares\/(.+)$/);
        if (match?.[1]) {
          await this.supabaseService.eliminarImagen(match[1]);
        }
      }

      this.messageService.add({
        severity: "success",
        summary: "Éxito",
        detail: "Profesor eliminado correctamente",
        life: 1900
      });

      this.profesores = this.profesores.filter(a => a.id !== id);

    } catch (error) {
      this.messageService.add({
        severity: "error",
        summary: "Error",
        detail: "El profesor tiene tribunales asignados",
        life: 1900
      });
    }
  }

}
