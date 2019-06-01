import { Injectable } from '@angular/core';
import {HttpClient, HttpClientModule, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs/index';

@Injectable({
  providedIn: 'root'
})
export class RegisterService {

  constructor(private http: HttpClient) { }
  register(firstName: string, middleName: string, lastName: string, birthDay: number, birthMonth: number, birthYear: number, userName: string, password: string): Observable<any> {
    const data = {
      FirstName: firstName,
      MiddleName: middleName,
      LastName: lastName,
      BirthDay: birthDay,
      BirthMonth: birthMonth,
      BirthYear: birthYear,
      UserName : userName,
      Password: password
    };
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json'
      })};
    return this.http.post<any>('http://localhost:4656/LogonRegister/register', data, httpOptions);
  }
}
