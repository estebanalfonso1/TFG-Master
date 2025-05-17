import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ActorService } from '../../../service/actor.service';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, CommonModule, ToastModule],
  providers: [MessageService],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  formLogin!: FormGroup;
  id!: number;
  passwordVisible: boolean = false;

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private actorService: ActorService,
    private messageService: MessageService
  ) {
    this.formLogin = this.fb.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required]]
    });
  }

  ngOnInit(): void {
    if (sessionStorage.getItem("token") !== null) {
      this.router.navigate(['/']);
    }
  }

  login() {
    const actor = this.formLogin.value;

    this.actorService.login(actor).subscribe(
      (tokenLogin) => {
        sessionStorage.setItem("token", tokenLogin.token);
        this.router.navigate(['/']).then(() => window.location.reload());
      },
      (error) => {
        // window.alert("Usuario y/o contraseña incorrectos");
      this.messageService.add ({
        severity: "error",
        summary:"Error al iniciar sesión",
        detail:"Usuario y/o contraseña incorrectos",
        life: 1900
      })        
      }
    );
  }

  togglePassword() {
    this.passwordVisible = !this.passwordVisible;
  }
}
