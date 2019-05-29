import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {Observable} from 'rxjs';
import {InSessionService} from '../session/insession.service';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  constructor(private http: HttpClient, private inSessionService: InSessionService) { }

  getCpu(): Observable<any> {
    return this.http.get<any>(environment.baseApiUrl + '/App/System/GetCpus',
      { withCredentials: true });
    // return this.http.get(environment.baseApiUrl + '/App/System/GetCpus',,{ withCredentials: true }).pipe();
  }
  getMemory(): Observable<any> {
    return this.http.get<any>(environment.baseApiUrl + '/App/System/Memory',
      { withCredentials: true });
    // return this.http.get(environment.baseApiUrl + '/App/System/GetCpus',,{ withCredentials: true }).pipe();
  }
}
