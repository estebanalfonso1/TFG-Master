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
  selector: 'app-list-tribunal-alumno',
  imports: [CommonModule],
  providers: [DatePipe],
  templateUrl: './list-tribunal-alumno.component.html',
  styleUrl: './list-tribunal-alumno.component.css'
})
export class ListTribunalAlumnoComponent implements OnInit {
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

  findAllTribunalesByAlumno() {
    this.tribunalService.getAllTribunalByAlumno().subscribe(
      result => { this.tribunales = result; this.listaTribunales = Array.from(this.tribunales); },
      error => { console.log(error) }
    );
  }

  editarTribunal(idTribunal: number) {
     this.tribunalService.getOneTribunal(idTribunal).subscribe(
      result => {
        const esDeAlumno = result.alumno.username == this.nombreUsuario;

        if (esDeAlumno) {
          this.router.navigateByUrl(`tribunal/editar/${idTribunal}`);
        } else {
          this.router.navigate(['/']);
        }
      },
      error => { console.log(error) }
    );
  }

  private comprobarRol() {
    const token = sessionStorage.getItem("token");
    console.log(this.tribunales.size)

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
}
