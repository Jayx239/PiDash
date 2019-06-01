import { Injectable } from '@angular/core';
import {HttpClient, HttpClientModule, HttpHeaders, HttpResponse} from '@angular/common/http';
import {Observable} from 'rxjs/index';
import {environment} from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LogonService {

  constructor(private http: HttpClient) { }
  logon(userName: string, password: string): Observable<any> {
    const data = {
      UserName : userName,
      Password: password
    };
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json'
      }),
      withCredentials: true
    };
    return this.http.post<any>(environment.baseApiUrl + '/LogonRegister/logon', data, httpOptions);
  }
}
