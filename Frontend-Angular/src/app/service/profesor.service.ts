import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { Profesor } from '../model/Profesor';

@Injectable({
    providedIn: 'root'
})
export class ProfesorService {

    constructor(private http: HttpClient) { }

    // URL API Backend
    private urlAPI = "https://tfg-master.onrender.com/profesor"

    saveProfesor(profesor: Profesor): Observable<void> {
        return this.http.post<void>(this.urlAPI, profesor);
    }

    editProfesor(profesor: Profesor): Observable<void> {
        return this.http.put<void>(this.urlAPI, profesor);
    }

    deleteProfesor(id: number): Observable<void> {
        const url = `${this.urlAPI}/${id}`;
        return this.http.delete<void>(url);
    }

    getOneProfesor(id: number): Observable<Profesor> {
        const url = `${this.urlAPI}/${id}`;
        return this.http.get<Profesor>(url);
    }

    getAllProfesor(): Observable<Profesor[]> {
        return this.http.get<Profesor[]>(this.urlAPI);
    }

}