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
import { Criterio } from '../../../model/Criterio';
import { CriterioService } from '../../../service/criterio.service';

@Component({
  selector: 'app-list-criterio',
  imports: [CommonModule, AvatarModule, TableModule, InputTextModule, TagModule,
    SelectModule, MultiSelectModule, ButtonModule, IconFieldModule, InputIconModule, FormsModule, RouterLink, ToastModule],
  providers: [MessageService],
  templateUrl: './list-criterio.component.html',
  styleUrl: './list-criterio.component.css'
})
export class ListCriterioComponent implements OnInit {
  public criterios: Criterio[] = [];
  buscarValor: string | undefined;


  constructor(
    private criterioService: CriterioService,
    private router: Router,
    private messageService: MessageService
  ) { }

  ngOnInit(): void {
    this.comprobarRol();
  }

  findAllRubricas() {
    this.criterioService.getAllCriterio().subscribe(
      result => {
        this.criterios = result;
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
    this.criterioService.deleteCriterio(id).subscribe(
      result => {
        this.messageService.add({
          severity: "success",
          summary: "Éxito",
          detail: "Criterio eliminado correctamente",
          life: 1900
        });
        this.criterios = this.criterios.filter(criterio => criterio.id !== id);
      },
      error => {
        this.messageService.add({
          severity: "error",
          summary: "Error",
          detail: "No se ha podido eliminar el criterio",
          life: 1900
        });
      }
    );
  }



}
