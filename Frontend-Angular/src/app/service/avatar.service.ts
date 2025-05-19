import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AvatarEstadoService {
  private letraSubject = new BehaviorSubject<string>('P');
  letra$ = this.letraSubject.asObservable();

  private fotoSubject = new BehaviorSubject<string | null>(null);
  foto$ = this.fotoSubject.asObservable();

  setLetra(letra: string) {
    this.letraSubject.next(letra.toUpperCase());
  }

  setFoto(url: string | null) {
    this.fotoSubject.next(url);
  }

  get letraActual(): string {
    return this.letraSubject.value;
  }

  get fotoActual(): string | null {
    return this.fotoSubject.value;
  }
}