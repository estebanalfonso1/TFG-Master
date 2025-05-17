import { CommonModule, NgClass } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { jwtDecode } from 'jwt-decode';
import { AvatarModule } from 'primeng/avatar';
import { AvatarGroupModule } from 'primeng/avatargroup';
import { MenuModule } from 'primeng/menu';
import { MenuItem } from 'primeng/api';
import { ActorService } from '../../../service/actor.service';
import { AvatarEstadoService } from '../../../service/avatar.service';


@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink, AvatarModule, AvatarGroupModule, MenuModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent implements OnInit {
  token: string | null = sessionStorage.getItem("token");
  hayToken!: boolean;
  rol!: string;
  nombreUsuario !: any;
  primeraLetra!: any;
  items!: MenuItem[];
  nombre !: any;

  constructor(private router: Router, private actorService: ActorService, private avatarEstado: AvatarEstadoService
  ) {
    if (this.token !== null && this.token) {
      this.nombreUsuario = jwtDecode(this.token).sub;
      this.rol = jwtDecode<{ rol: string }>(this.token).rol;
    }
  }

  ngOnInit(): void {
    if (sessionStorage.getItem("token") !== null) {
      this.hayToken = true;
      this.actorService.userLogin().subscribe(usuario => {
        this.nombre = usuario.nombre;
        const letra = this.nombre.charAt(0).toUpperCase();
        this.avatarEstado.setLetra(letra);
      });

      this.avatarEstado.letra$.subscribe(letra => {
        this.primeraLetra = letra;
      });

    } else {
      this.hayToken = false;
    }

    this.items = [
      { label: 'Editar', icon: 'pi pi-user', command: () => this.editarDatos() },
      { label: 'Cerrar sesión', icon: 'pi pi-sign-out', command: () => this.logout() }
    ];
  }


  logout() {
    sessionStorage.removeItem("token");
    window.location.reload();
  }

  editarDatos() {
    const ruta = this.rol.toLowerCase();
    this.router.navigate([`/${ruta}/editar`]);
  }

}
