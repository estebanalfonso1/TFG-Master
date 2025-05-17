import { Component, OnInit } from '@angular/core';
import { Alumno } from '../../../model/Alumno';
import { AlumnoService } from '../../../service/alumno.service';
import { Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';
import { CommonModule } from '@angular/common';
import { Tribunal } from '../../../model/Tribunal';
import { TribunalService } from '../../../service/tribunal.service';
import { DatePipe } from '@angular/common';
import { ValoracionService } from '../../../service/valoracion.service';

@Component({
  selector: 'app-list-tribunal-profesor',
  imports: [CommonModule],
  providers: [DatePipe],
  templateUrl: './list-tribunal-profesor.component.html',
  styleUrl: './list-tribunal-profesor.component.css'
})
export class ListTribunalProfesorComponent implements OnInit {
  public tribunales: Set<Tribunal> = new Set<Tribunal>;
  public listaTribunales: Tribunal[] = [];
  token: string | null = sessionStorage.getItem("token");
  rol!: string;

  nombreUsuario !: any;

  constructor(
    private tribunalService: TribunalService,
    private valoracionService: ValoracionService,
    private router: Router
  ) {
    if (this.token !== null && this.token) {
      this.nombreUsuario = jwtDecode(this.token).sub;
      this.rol = jwtDecode<{ rol: string }>(this.token).rol;
    }
  }

  ngOnInit(): void {
    this.comprobarRol();
  }

  findAllTribunalesByProfesor() {
    this.tribunalService.getAllTribunalByProfesor().subscribe(
      result => { this.tribunales = result; this.listaTribunales = Array.from(this.tribunales); },
      error => { console.log(error) }
    );
  }

  private comprobarRol() {
    const token = sessionStorage.getItem("token");
    console.log(this.tribunales.size)

    if (token) {
      const decodedToken = jwtDecode<{ rol: string }>(token);
      if (decodedToken.rol === "PROFESOR") {
        this.findAllTribunalesByProfesor();
      } else {
        this.router.navigate(['/']);
      }
    } else {
      this.router.navigate(['/']);
    }
  }

  editarValoracion(idTribunal: number) {
    this.valoracionService.getAllValoracion().subscribe(
      result => {
        const valoracionEncontrada = result.find(
          valoracion =>
            valoracion.tribunal.id === idTribunal &&
            valoracion.profesor.username === this.nombreUsuario
        );

        if (valoracionEncontrada) {
          this.router.navigateByUrl(`tribunales/asignados/valorar/${idTribunal}`);
        } else {
          this.router.navigate(['/']);
        }
      },
      error => { console.log(error) }
    );
  }

  eliminarTribunal(id: number) {
    this.tribunalService.deleteTribunal(id).subscribe(
      result => {
        window.location.reload()
      },
      error => {
        this.router.navigate(['/']);
      }
    )
  }
}
