import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class InSessionService {

  constructor() { }

  getSessionCookie(): string {
    return 'session=' + localStorage.getItem('session');
  }
}
