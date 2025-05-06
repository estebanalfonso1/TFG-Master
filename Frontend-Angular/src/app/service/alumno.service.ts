import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { Alumno } from '../model/Alumno';

@Injectable({
    providedIn: 'root'
})
export class AlumnoService {

    constructor(private http: HttpClient) { }

    // URL API Backend
    private urlAPI = "http://localhost:8080/alumno"

    saveAlumno(alumno: Alumno): Observable<void> {
        return this.http.post<void>(this.urlAPI, alumno);
    }

    editAlumno(alumno: Alumno): Observable<void> {
        return this.http.put<void>(this.urlAPI, alumno);
    }

    editAlumnoById(id: number, alumno: Alumno): Observable<void> {
        const url = `${this.urlAPI}/${id}`;
        return this.http.put<void>(url, alumno);
    }

    deleteAlumno(): Observable<void> {
        return this.http.delete<void>(this.urlAPI);
    }

    getOneAlumno(id: number): Observable<Alumno> {
        const url = `${this.urlAPI}/${id}`;
        return this.http.get<Alumno>(url);
    }

    getAllAlumno(): Observable<Alumno[]> {
        return this.http.get<Alumno[]>(this.urlAPI);
    }

}