import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';
import { CommonModule } from '@angular/common';
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
import { Valoracion } from '../../../model/Valoracion';

@Component({
  selector: 'app-list-valoracion',
  imports: [
    CommonModule, AvatarModule, TableModule, InputTextModule, TagModule,
    SelectModule, MultiSelectModule, ButtonModule, IconFieldModule, InputIconModule,
    FormsModule, ToastModule
  ],
  providers: [DatePipe, MessageService],
  templateUrl: './list-valoracion.component.html',
  styleUrl: './list-valoracion.component.css'
})
export class ListValoracionComponent implements OnInit {
  public valoraciones: Set<Valoracion> = new Set<Valoracion>;
  public listaValoraciones: Valoracion[] = [];
  token: string | null = sessionStorage.getItem("token");
  rol!: string;
  nombreUsuario!: any;
  idTribunal!: number;

  constructor(
    private valoracionService: ValoracionService,
    private router: Router,
    private messageService: MessageService,
    private route: ActivatedRoute,
  ) {
    if (this.token !== null && this.token) {
      this.nombreUsuario = jwtDecode(this.token).sub;
      this.rol = jwtDecode<{ rol: string }>(this.token).rol;
    }
  }

  ngOnInit(): void {
    this.idTribunal = Number(this.route.snapshot.paramMap.get('id'));
    this.comprobarRol();
  }

  findAllValoracionesByTribunal() {
    this.valoracionService.getAllValoracionesByTribunal(this.idTribunal).subscribe(
      result => {
        this.valoraciones = result;
        this.listaValoraciones = Array.from(this.valoraciones);
      },
      error => { console.log(error); }
    );
  }

  private comprobarRol() {
    const token = sessionStorage.getItem("token");
    if (token) {
      const decodedToken = jwtDecode<{ rol: string }>(token);
      if (decodedToken.rol === "ALUMNO") {
        this.findAllValoracionesByTribunal();
      } else {
        this.router.navigate(['/']);
      }
    } else {
      this.router.navigate(['/']);
    }
  }

  aprobado(valoracion: number, valoracionMinima: number, valoracionMaxima: number) {
    if (valoracion >= ((valoracionMaxima-valoracionMinima)/2)+valoracionMinima ) return true;
    return false
  }

   volver() {
    this.router.navigate(['/tribunales/mistribunales']);
  }

}

