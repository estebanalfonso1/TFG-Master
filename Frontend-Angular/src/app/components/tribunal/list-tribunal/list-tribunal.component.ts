import { Component, OnInit } from '@angular/core';
import { Alumno } from '../../../model/Alumno';
import { AlumnoService } from '../../../service/alumno.service';
import { Router, RouterLink } from '@angular/router';
import { jwtDecode } from 'jwt-decode';
import { CommonModule } from '@angular/common';
import { Tribunal } from '../../../model/Tribunal';
import { TribunalService } from '../../../service/tribunal.service';
import { DatePipe } from '@angular/common';
import { ValoracionService } from '../../../service/valoracion.service';
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
import { SupabaseServiceArchivo } from '../../../service/supabaseArchivo.service';

@Component({
  selector: 'app-list-tribunal',
  imports: [CommonModule, AvatarModule, TableModule, InputTextModule, TagModule,
    SelectModule, MultiSelectModule, ButtonModule, IconFieldModule, InputIconModule, FormsModule, ToastModule, RouterLink],
  providers: [DatePipe, MessageService],
  templateUrl: './list-tribunal.component.html',
  styleUrl: './list-tribunal.component.css'
})
export class ListTribunalComponent implements OnInit {
  public listaTribunales: Tribunal[] = [];
  token: string | null = sessionStorage.getItem("token");
  rol!: string;
  nombreUsuario !: any;
  public urlArchivo: { [tribunalId: number]: string | null } = {};
  fechaNula = 0;

  constructor(
    private tribunalService: TribunalService,
    private router: Router,
    private messageService: MessageService,
    private supabaseService: SupabaseServiceArchivo
  ) {
    if (this.token !== null && this.token) {
      this.nombreUsuario = jwtDecode(this.token).sub;
      this.rol = jwtDecode<{ rol: string }>(this.token).rol;
    }
  }

  ngOnInit(): void {
    this.comprobarRol();
  }

  findAllTribunales() {
    this.tribunalService.getAllTribunal().subscribe(
      result => {
        this.listaTribunales = result;
        this.listaTribunales = Array.from(this.listaTribunales).map(
          tribunal => ({
            ...tribunal,
            nombreAlumnoCompleto: `${tribunal.alumno.nombre} ${tribunal.alumno.apellido1} ${tribunal.alumno.apellido2}`,
            fechaEntrega: new Date(tribunal.fechaEntrega),
            fechaFin: new Date(tribunal.fechaFin)
          })
        )


        for (const tribunal of this.listaTribunales) {
          this.cargarUrlArchivo(tribunal);
        }
      },
      error => { console.log(error) }
    );
  }

  fechaEntregaNula(fecha: Date | null): boolean {
    return !!fecha && fecha.getTime() === this.fechaNula;
  }

  private comprobarRol() {
    const token = sessionStorage.getItem("token");
    console.log(this.listaTribunales.length)

    if (token) {
      const decodedToken = jwtDecode<{ rol: string }>(token);
      if (decodedToken.rol === "ADMINISTRADOR") {
        this.findAllTribunales();
      } else {
        this.router.navigate(['/']);
      }
    } else {
      this.router.navigate(['/']);
    }
  }

  eliminarTribunal(id: number) {
    this.tribunalService.deleteTribunal(id).subscribe(
      result => {
        this.messageService.add({
          severity: "success",
          summary: "Éxito",
          detail: "Tribunal eliminado correctamente",
          life: 1900
        });
        window.location.reload()
      },
      error => {
        this.messageService.add({
          severity: "error",
          summary: "Error",
          detail: "No se ha podido eliminar el tribunal",
          life: 1900
        });
      }
    )
  }

  abrirArchivo(url: string | null) {
    if (url) {
      window.open(url, '_blank', 'noopener');
    }
  }

  async cargarUrlArchivo(tribunal: Tribunal) {
    if (tribunal.archivo) {
      const url = await this.supabaseService.obtenerUrlSupabase(tribunal.archivo);
      this.urlArchivo[tribunal.id] = url;
    } else {
      this.urlArchivo[tribunal.id] = null;
    }
  }
}
