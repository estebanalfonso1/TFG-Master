import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { jwtDecode } from 'jwt-decode';

@Component({
  selector: 'app-navbar',
  imports: [CommonModule, RouterLink],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent implements OnInit {
  token: string | null = sessionStorage.getItem("token");
  hayToken!: boolean;
  rol!: string;
  nombreUsuario !: any;

  constructor(private router: Router) {
    if (this.token !== null && this.token) {
      this.nombreUsuario = jwtDecode(this.token).sub;
      this.rol = jwtDecode<{ rol: string }>(this.token).rol;
    }
  }

  ngOnInit(): void {
    if (sessionStorage.getItem("token") !== null) {
      this.hayToken = true;
    } else {
      this.hayToken = false;
    }
  }
}
