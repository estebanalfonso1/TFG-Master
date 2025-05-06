import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Profesor } from '../../../model/Profesor';
import { ProfesorService } from '../../../service/profesor.service';
import { jwtDecode } from 'jwt-decode';
import { Router } from '@angular/router';

@Component({
  selector: 'app-list-profesor',
  imports: [CommonModule],
  templateUrl: './list-profesor.component.html',
  styleUrl: './list-profesor.component.css'
})
export class ListProfesorComponent implements OnInit {
 public profesores: Profesor[] = [];

  constructor(
    private profesorService: ProfesorService,
    private router: Router
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
}
