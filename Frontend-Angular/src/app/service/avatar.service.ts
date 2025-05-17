import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AvatarEstadoService {
  private letraSubject = new BehaviorSubject<string>('P');
  letra$ = this.letraSubject.asObservable();

  setLetra(letra: string) {
    this.letraSubject.next(letra.toUpperCase());
  }

  get letraActual(): string {
    return this.letraSubject.value;
  }
}
