import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { Tribunal } from '../model/Tribunal';
import { Profesor } from '../model/Profesor';
import { Rubrica } from '../model/Rubrica';

@Injectable({
    providedIn: 'root'
})
export class TribunalService {

    constructor(private http: HttpClient) { }

    private urlAPI = "http://localhost:8080/tribunal"

    saveTribunal(tribunal: Tribunal): Observable<void> {
        return this.http.post<void>(this.urlAPI, tribunal);
    }

    editTribunal(id: number, tribunal: Tribunal): Observable<void> {
        const url = `${this.urlAPI}/${id}`;
        return this.http.put<void>(url, tribunal);
    }

    deleteTribunal(id: number): Observable<void> {
        const url = `${this.urlAPI}/${id}`;
        return this.http.delete<void>(url);
    }

    getOneTribunal(id: number): Observable<Tribunal> {
        const url = `${this.urlAPI}/${id}`;
        return this.http.get<Tribunal>(url);
    }

    getAllTribunal(): Observable<Tribunal[]> {
        return this.http.get<Tribunal[]>(this.urlAPI);
    }

    getAllTribunalByProfesor(): Observable<Set<Tribunal>> {
        const url = `${this.urlAPI}/deProfesor`;
        return this.http.get<Set<Tribunal>>(url);
    }

    getAllProfesoresByTribunal(id: number): Observable<Set<Profesor>> {
        const url = `${this.urlAPI}/profesores/${id}`;
        return this.http.get<Set<Profesor>>(url);
    }

    getRubricasByTribunal(id: number): Observable<Set<Rubrica>> {
        const url = `${this.urlAPI}/rubricas/${id}`;
        return this.http.get<Set<Rubrica>>(url);
    }

    qualifyTribunal(id: number): Observable<Tribunal> {
        const url = `${this.urlAPI}/calificar/${id}`;
        return this.http.get<Tribunal>(url);
    }

}