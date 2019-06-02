import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AccountService {

  constructor(private httpClient: HttpClient) { }

  resetPassword(currentPassword: string, newPassword: string, repeatNewPassword: string): Observable<Response> {
    return this.httpClient.post<Response>(environment.baseApiUrl + '/Account/ChangePassword',
      { OldPassword: currentPassword, NewPassword: newPassword, RepeatNewPassword: repeatNewPassword},
      {headers: {'Content-Type': 'application/json'}, withCredentials: true});
  }
}

export class Response {
  successful: boolean;
  message: string;
}
