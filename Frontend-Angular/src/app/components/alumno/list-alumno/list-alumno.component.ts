import { Component, OnInit } from '@angular/core';
import { Alumno } from '../../../model/Alumno';
import { AlumnoService } from '../../../service/alumno.service';
import { Router } from '@angular/router';
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

@Component({
  selector: 'app-list-alumno',
  imports: [CommonModule, AvatarModule, TableModule, InputTextModule, TagModule,
    SelectModule, MultiSelectModule, ButtonModule, IconFieldModule, InputIconModule, FormsModule],
  templateUrl: './list-alumno.component.html',
  styleUrl: './list-alumno.component.css'
})
export class ListAlumnoComponent implements OnInit {
  public alumnos: Alumno[] = [];
      searchValue: string | undefined;


  constructor(
    private alumnoService: AlumnoService,
    private router: Router,
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
