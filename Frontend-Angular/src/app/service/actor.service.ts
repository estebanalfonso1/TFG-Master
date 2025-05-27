import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ActorLogin } from '../model/ActorLogin';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ActorService {
  private urlAPI = environment.baseUrl;

  constructor(private http: HttpClient) { }

  login(actorLogin: ActorLogin): Observable<any> {
    return this.http.post<any>(`${this.urlAPI}/login`, actorLogin);
  }

  userLogin(): Observable<any> {
    return this.http.get<any>(`${this.urlAPI}/userLogin`);
  }

  actorExist(username: string): Observable<boolean> {
    return this.http.get<boolean>(`${this.urlAPI}/actorExiste/${username}`);
  }
}