import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { Valoracion } from '../model/Valoracion';

@Injectable({
    providedIn: 'root'
})
export class ValoracionService {

    constructor(private http: HttpClient) { }

    private urlAPI = "https://tfg-master.onrender.com/valoracion"

    saveValoracion(valoracion: Valoracion): Observable<void> {
        return this.http.post<void>(this.urlAPI, valoracion);
    }

    editValoracion(id: number, valoracion: Valoracion): Observable<void> {
        const url = `${this.urlAPI}/${id}`;
        return this.http.put<void>(url, valoracion);
    }

    deleteValoracion(id: number): Observable<void> {
        const url = `${this.urlAPI}/${id}`;
        return this.http.delete<void>(url);
    }

    getOneValoracion(id: number): Observable<Valoracion> {
        const url = `${this.urlAPI}/${id}`;
        return this.http.get<Valoracion>(url);
    }

    getAllValoracionesByTribunal(id: number): Observable<Set<Valoracion>> {
        const url = `${this.urlAPI}/deTribunal/${id}`;
        return this.http.get<Set<Valoracion>>(url);
    }

    getAllValoracion(): Observable<Valoracion[]> {
        return this.http.get<Valoracion[]>(this.urlAPI);
    }

    cargarCalificacion(id: number): Observable<Valoracion> {
        const url = `${this.urlAPI}/calificacion/${id}`;
        return this.http.get<Valoracion>(url);
    }

}