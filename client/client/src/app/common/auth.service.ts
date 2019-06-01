import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {environment} from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  User: User;
  constructor(private httpClient: HttpClient) { }

  isLoggedIn(): Observable<boolean> {
    return this.httpClient.get<boolean>(environment.baseApiUrl + '/notripped', {withCredentials: true});
  }
}

export class User {
  userName: string;
  userNumber: number;

  User(userName: string, userNumber: number) {
    this.userName = userName;
    this.userNumber = userNumber;
  }
}
