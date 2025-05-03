import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { Administrador } from '../model/Administrador';

@Injectable({
    providedIn: 'root'
})
export class AdministradorService {

    constructor(private http: HttpClient) { }

    // URL API Backend
    private urlAPI = "http://localhost:8080/administrador"

    saveAdministrador(administrador: Administrador): Observable<void> {
        return this.http.post<void>(this.urlAPI, administrador);
    }

    editAdministrador(administrador: Administrador): Observable<void> {
        return this.http.put<void>(this.urlAPI, administrador);
    }

    deleteAdministrador(): Observable<void> {
        return this.http.delete<void>(this.urlAPI);
    }

}