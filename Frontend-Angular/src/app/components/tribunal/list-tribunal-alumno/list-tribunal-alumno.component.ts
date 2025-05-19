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
    // Quité FileUpload porque ya no lo usas
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

  // Mapa tribunal.id -> URL firmada
  public signedUrls: { [tribunalId: number]: string | null } = {};

  // Cambio aquí: para guardar archivos seleccionados, ahora arreglo de archivos (solo 1 por tribunal)
  public selectedFilesMap: { [tribunalId: number]: File[] } = {};

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

  async findAllTribunalesByAlumno() {
    this.tribunalService.getAllTribunalByAlumno().subscribe(
      async result => {
        this.tribunales = result;
        this.listaTribunales = Array.from(this.tribunales);

        // Para cada tribunal, cargar URL firmada si archivo existe
        for (const tribunal of this.listaTribunales) {
          await this.loadSignedUrl(tribunal);
          // Inicializa selección archivo como arreglo vacío
          this.selectedFilesMap[tribunal.id] = [];
        }
      },
      error => { console.log(error); }
    );
  }

  async loadSignedUrl(tribunal: Tribunal) {
    if (tribunal.archivo) {
      const url = await this.supabaseService.getSignedUrl(tribunal.archivo);
      this.signedUrls[tribunal.id] = url;
    } else {
      this.signedUrls[tribunal.id] = null;
    }
  }

  editarTribunal(id: number, tribunal: Tribunal, callback?: () => void) {
    this.tribunalService.editTribunal(id, tribunal).subscribe(
      result => {
        this.messageService.add({
          severity: 'success',
          summary: 'Tribunal actualizado',
          detail: 'Los cambios han sido guardados.'
        });

        if (callback) callback(); // solo recarga URL si todo salió bien
      },
      error => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudo actualizar el tribunal.'
        });
        console.log("Tribunal no actualizado", error);
      }
    );
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

  // NUEVO método para cuando se elige archivo en el input file
  onFileChosen(event: Event, tribunal: Tribunal): void {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) return;

    const file = input.files[0];
    const ext = file.name.split('.').pop()?.toLowerCase();

    if (ext !== 'zip') {
      this.messageService.add({
        severity: 'error',
        summary: 'Archivo no permitido',
        detail: 'Solo se permiten archivos con extensión .zip'
      });
      input.value = ''; // limpiar selección inválida
      return;
    }

    this.selectedFilesMap[tribunal.id] = [file];
  }

  // Método para subir archivo (cuando presionan subir)
  async uploadSelectedFile(tribunal: Tribunal): Promise<void> {
    const files = this.selectedFilesMap[tribunal.id];
    if (!files || files.length === 0) return;

    const file = files[0];

    // Borra archivo viejo si existe
    if (tribunal.archivo) {
      const deleted = await this.supabaseService.deleteArchivo(tribunal.archivo);
      if (!deleted) {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudo eliminar el archivo anterior.'
        });
        return;
      }
    }

    const ext = file.name.split('.').pop()?.toLowerCase();
    const fileName = `${tribunal.alumno.username}_${Date.now()}.${ext}`;
    const newPath = await this.supabaseService.uploadArchivo(file, fileName);
    if (!newPath) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error al subir',
        detail: 'No se pudo subir el archivo.'
      });
      return;
    }

    tribunal.archivo = fileName;
    this.editarTribunal(tribunal.id, tribunal);

    this.messageService.add({
      severity: 'success',
      summary: 'Archivo subido',
      detail: file.name
    });

    // Limpiar selección
    this.selectedFilesMap[tribunal.id] = [];
  }

}

