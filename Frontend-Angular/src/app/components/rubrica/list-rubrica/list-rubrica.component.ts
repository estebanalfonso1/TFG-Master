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
import { Rubrica } from '../../../model/Rubrica';
import { RubricaService } from '../../../service/rubrica.service';

@Component({
  selector: 'app-list-rubrica',
  imports: [CommonModule, AvatarModule, TableModule, InputTextModule, TagModule,
    SelectModule, MultiSelectModule, ButtonModule, IconFieldModule, InputIconModule, FormsModule, RouterLink, ToastModule],
  providers: [MessageService],
  templateUrl: './list-rubrica.component.html',
  styleUrl: './list-rubrica.component.css'
})
export class ListRubricaComponent implements OnInit {
  public rubricas: Rubrica[] = [];
  searchValue: string | undefined;


  constructor(
    private rubricaService: RubricaService,
    private router: Router,
    private messageService: MessageService
  ) { }

  ngOnInit(): void {
    this.comprobarRol();
  }

  findAllRubricas() {
    this.rubricaService.getAllRubrica().subscribe(
      result => {
        this.rubricas = result.map(
          rubrica => ({
            ...rubrica,
            fechaPublicacion: new Date(rubrica.fechaPublicacion)
          })
        )
      },
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
        this.findAllRubricas();
      }
    } else {
      this.router.navigate(['/']);
    }
  }

  eliminar(id: number) {
    this.rubricaService.deleteRubrica(id).subscribe(
      result => {
        this.messageService.add({
          severity: "success",
          summary: "Éxito",
          detail: "Rúbrica eliminada correctamente",
          life: 1900
        });
        this.rubricas = this.rubricas.filter(rubrica => rubrica.id !== id);
      },
      error => {
        this.messageService.add({
          severity: "error",
          summary: "Error",
          detail: "No se ha podido eliminar la rúbrica",
          life: 1900
        });
      }
    );
  }



}
