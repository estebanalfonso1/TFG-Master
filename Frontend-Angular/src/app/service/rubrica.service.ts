import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { Rubrica } from '../model/Rubrica';

@Injectable({
    providedIn: 'root'
})
export class RubricaService {

    constructor(private http: HttpClient) { }

    private urlAPI = "http://localhost:8080/rubrica"

    saveRubrica(rubrica: Rubrica): Observable<void> {
        return this.http.post<void>(this.urlAPI, rubrica);
    }

    editRubrica(id: number, rubrica: Rubrica): Observable<void> {
        const url = `${this.urlAPI}/${id}`;
        return this.http.put<void>(url, rubrica);
    }

    deleteRubrica(id: number): Observable<void> {
        const url = `${this.urlAPI}/${id}`;
        return this.http.delete<void>(url);
    }

    getOneRubrica(id: number): Observable<Rubrica> {
        const url = `${this.urlAPI}/${id}`;
        return this.http.get<Rubrica>(url);
    }

    getAllRubrica(): Observable<Rubrica[]> {
        return this.http.get<Rubrica[]>(this.urlAPI);
    }

}