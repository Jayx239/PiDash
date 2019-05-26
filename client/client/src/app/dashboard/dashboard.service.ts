import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  constructor(private http: HttpClient) { }

  getCpu(): Observable<any> {
    return this.http.get(environment.baseApiUrl + '/App/System/GetCpus', { withCredentials: true }).pipe();
    // return this.http.get(environment.baseApiUrl + '/App/System/GetCpus',,{ withCredentials: true }).pipe();
  }
}
