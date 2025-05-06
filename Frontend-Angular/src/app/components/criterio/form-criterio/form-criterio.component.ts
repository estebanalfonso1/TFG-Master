import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CriterioService } from '../../../service/criterio.service';
import { CommonModule } from '@angular/common';
import { jwtDecode } from 'jwt-decode';

@Component({
  selector: 'app-form-criterio',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './form-criterio.component.html',
  styleUrl: './form-criterio.component.css'
})
export class FormCriterioComponent implements OnInit {
  formCriterio!: FormGroup;
  id!: number;

  constructor(
    private criterioService: CriterioService,
    private router: Router,
    private route: ActivatedRoute,
    private fb: FormBuilder
  ) {
    this.formCriterio = this.fb.group(
      {
        puntuacionObtenida: ['', [Validators.min(0), Validators.max(10)]],
        puntuacionMaxima: ['', [Validators.min(0), Validators.max(10)]],
        puntuacionMinima: ['', [Validators.min(0), Validators.max(10)]],
        puntuacionDeTutor: [false],
        descripcion: ['', [Validators.required]]
      });
  }

  ngOnInit(): void {
    this.comprobarRol();
    this.id = Number(this.route.snapshot.paramMap.get('id'));
    if (this.id > 0) {
      this.criterioService.getOneCriterio(this.id).subscribe(
        result => { this.formCriterio.patchValue(result) },
        error => { console.log("Criterio no encontrado") }
      );
    }
  }

  save() {
    const criterio = this.formCriterio.value;

    if (this.id > 0) {
      this.criterioService.editCriterio(this.id, criterio).subscribe(
        result => {
          this.router.navigateByUrl("/criterio");
          this.router.navigateByUrl("/");
        },
        error => { console.log("Criterio no actualizado") }
      );
    } else {
      this.criterioService.saveCriterio(criterio).subscribe(
        result => {
          this.router.navigateByUrl("/criterio")
          this.router.navigateByUrl("/");
        },
        error => { console.log("Criterio no creado") }
      );
    }
  }

  private comprobarRol() {
    const token = sessionStorage.getItem("token");

    if (token) {
      const decodedToken = jwtDecode<{ rol: string }>(token);
      if (decodedToken.rol != "PROFESOR") {
        this.router.navigate(['/']);
      }
    } else {
      this.router.navigate(['/']);
    }
  }
}