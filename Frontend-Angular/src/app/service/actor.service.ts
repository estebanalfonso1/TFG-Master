import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ActorLogin } from '../model/ActorLogin';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ActorService {

  constructor(private http: HttpClient) { }

  // URL API Backend
  private urlAPI = "http://localhost:8080/login"

  login(actorLogin: ActorLogin): Observable<any> {
    return this.http.post<any>(this.urlAPI, actorLogin);
  }

}
