import { Component, OnInit } from '@angular/core';
import { Alumno } from '../../../model/Alumno';
import { AlumnoService } from '../../../service/alumno.service';
import { Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-list-alumno',
  imports: [CommonModule],
  templateUrl: './list-alumno.component.html',
  styleUrl: './list-alumno.component.css'
})
export class ListAlumnoComponent implements OnInit {
  public alumnos: Alumno[] = [];

  constructor(
    private alumnoService: AlumnoService,
    private router: Router
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
}
