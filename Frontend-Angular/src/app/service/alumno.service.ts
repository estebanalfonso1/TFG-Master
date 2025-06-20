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
    private urlAPI = "https://tfg-master.onrender.com/alumno"

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

    deleteAlumno(id: number): Observable<void> {
        const url = `${this.urlAPI}/${id}`;
        return this.http.delete<void>(url);
    }

    getOneAlumno(id: number): Observable<Alumno> {
        const url = `${this.urlAPI}/${id}`;
        return this.http.get<Alumno>(url);
    }

    getAllAlumno(): Observable<Alumno[]> {
        return this.http.get<Alumno[]>(this.urlAPI);
    }

    getAllAlumnoByProfesor(): Observable<Alumno[]> {
        const url = `${this.urlAPI}/deProfesor`;
        return this.http.get<Alumno[]>(url);
    }

}