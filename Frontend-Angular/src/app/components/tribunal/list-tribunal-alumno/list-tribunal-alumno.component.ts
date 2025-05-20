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
import { SupabaseService } from '../../../service/supabaseArchivo.service';
import { FileUpload } from 'primeng/fileupload';

@Component({
  selector: 'app-list-tribunal-alumno',
  imports: [
    CommonModule, AvatarModule, TableModule, InputTextModule, TagModule,
    SelectModule, MultiSelectModule, ButtonModule, IconFieldModule, InputIconModule,
    FormsModule, ToastModule, RouterLink
  ],
  providers: [DatePipe, MessageService],
  templateUrl: './list-tribunal-alumno.component.html',
  styleUrl: './list-tribunal-alumno.component.css'
})
export class ListTribunalAlumnoComponent implements OnInit {
  public tribunales: Set<Tribunal> = new Set<Tribunal>;
  public listaTribunales: Tribunal[] = [];
  token: string | null = sessionStorage.getItem("token");
  rol!: string;
  nombreUsuario!: any;
  public urlArchivo: { [tribunalId: number]: string | null } = {};
  public archivoSeleccionado: { [tribunalId: number]: File[] } = {};
  public fechaActual = new Date();

  constructor(
    private tribunalService: TribunalService,
    private valoracionService: ValoracionService,
    private router: Router,
    private messageService: MessageService,
    private supabaseService: SupabaseService
  ) {
    if (this.token !== null && this.token) {
      this.nombreUsuario = jwtDecode(this.token).sub;
      this.rol = jwtDecode<{ rol: string }>(this.token).rol;
    }
  }

  ngOnInit(): void {
    this.comprobarRol();
  }

  fechaActualEsAnterior(fechaFin: Date) {
    return this.fechaActual < fechaFin;
  }

  async findAllTribunalesByAlumno() {
    this.tribunalService.getAllTribunalByAlumno().subscribe(
      async result => {
        this.tribunales = result;
        this.listaTribunales = Array.from(this.tribunales);

        for (const tribunal of this.listaTribunales) {
          await this.cargarUrlArchivo(tribunal);
          this.archivoSeleccionado[tribunal.id] = [];
        }
      },
      error => { console.log(error); }
    );
  }

  async cargarUrlArchivo(tribunal: Tribunal) {
    if (tribunal.archivo) {
      const url = await this.supabaseService.obtenerUrlSupabase(tribunal.archivo);
      this.urlArchivo[tribunal.id] = url;
    } else {
      this.urlArchivo[tribunal.id] = null;
    }
  }

  editarTribunal(id: number, tribunal: Tribunal, callback?: () => void) {
    this.tribunalService.editTribunal(id, tribunal).subscribe(
      result => {
        console.log('Tribunal actualizado')

        if (callback) callback();

      },
      error => {
        console.log("El tribunal no se ha podido actualizar", error);
      }
    );
  }

  abrirArchivo(url: string | null) {
    if (url) {
      window.open(url, '_blank', 'noopener');
    }
  }


  private comprobarRol() {
    const token = sessionStorage.getItem("token");
    if (token) {
      const decodedToken = jwtDecode<{ rol: string }>(token);
      if (decodedToken.rol === "ALUMNO") {
        this.findAllTribunalesByAlumno();
      } else {
        this.router.navigate(['/']);
      }
    } else {
      this.router.navigate(['/']);
    }
  }

  elegirArchivo(evento: Event, tribunal: Tribunal): void {
    const archivoSeleccionado = evento.target as HTMLInputElement;

    if (archivoSeleccionado.files && archivoSeleccionado.files.length != 0) {

      const archivo = archivoSeleccionado.files[0];
      const extensionArchivo = archivo.name.split('.').pop()?.toLowerCase();

      if (extensionArchivo !== 'zip') {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Sólo se permiten archivos .ZIP'
        });

        archivoSeleccionado.value = '';
        return;
      }

      this.archivoSeleccionado[tribunal.id] = [archivo];
    }
  }

  async subirArchivoSeleccionado(tribunal: Tribunal): Promise<void> {
    const archivo = this.archivoSeleccionado[tribunal.id];

    if (archivo && archivo.length != 0) {

      const archivoSubido = archivo[0];

      const extension = archivoSubido.name.split('.').pop()?.toLowerCase();
      const nombreArchivo = `${tribunal.alumno.username}_${Date.now()}.${extension}`;

      const nuevoArchivo = await this.supabaseService.subirArchivo(archivoSubido, nombreArchivo);

      if (!nuevoArchivo) {
        console.log("No se ha subido el archivo")
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'El archivo seleccionado pesa más de 50MB',
        });
        return;
      }

      if (tribunal.archivo) {
        await this.supabaseService.eliminarArchivo(tribunal.archivo);
      }

      tribunal.archivo = nombreArchivo;

      this.editarTribunal(tribunal.id, tribunal);

      await this.cargarUrlArchivo(tribunal);

      this.messageService.add({
        severity: 'success',
        summary: 'Éxito',
        detail: 'Entrega realizada con éxito.'
      });

      this.archivoSeleccionado[tribunal.id] = [];

      this.findAllTribunalesByAlumno();
    }
  }
}

