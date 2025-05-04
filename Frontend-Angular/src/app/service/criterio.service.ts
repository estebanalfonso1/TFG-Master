import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { Criterio } from '../model/Criterio';

@Injectable({
    providedIn: 'root'
})
export class CriterioService {

    constructor(private http: HttpClient) { }

    private urlAPI = "http://localhost:8080/criterio"

    saveCriterio(criterio: Criterio): Observable<void> {
        return this.http.post<void>(this.urlAPI, criterio);
    }

    editCriterio(id: number, criterio: Criterio): Observable<void> {
        const url = `${this.urlAPI}/${id}`;
        return this.http.put<void>(url, criterio);
    }

    deleteCriterio(id: number): Observable<void> {
        const url = `${this.urlAPI}/${id}`;
        return this.http.delete<void>(url);
    }

    getOneCriterio(id: number): Observable<Criterio> {
        const url = `${this.urlAPI}/${id}`;
        return this.http.get<Criterio>(url);
    }

    getAllCriterio(): Observable<Criterio[]> {
        return this.http.get<Criterio[]>(this.urlAPI);
    }

}