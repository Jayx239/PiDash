import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {environment} from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private httpClient: HttpClient) { }

  isLoggedIn(): Observable<boolean> {
    return this.httpClient.get<boolean>(environment.baseApiUrl + '/notripped', {withCredentials: true});
  }

  logout(): Observable<any> {
    return this.httpClient.get<boolean>(environment.baseApiUrl + '/Logout', {withCredentials: true});
  }

  getUser(): Observable<User> {
    return this.httpClient.get<User>(environment.baseApiUrl + '/LogonRegister/User', {withCredentials: true});
  }
}

export class User {
  userName: string;
  userNumber: number;
  isAdmin: boolean;

  constructor(userName: string, userNumber: number, isAdmin: boolean) {
    this.userName = userName;
    this.userNumber = userNumber;
    this.isAdmin = isAdmin;
  }
}
