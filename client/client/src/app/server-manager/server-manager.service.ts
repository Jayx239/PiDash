import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ServerManagerService {

  constructor(private http: HttpClient) { }

  /* Methods */
  spawnProcess(userCommand): Observable<any> {
    return this.http.post(environment.baseApiUrl + '/Process/Spawn', {Command: userCommand}, {headers: new HttpHeaders({
        'Content-Type':  'application/json'
      }),
      withCredentials: true});
  }

  getConsoleByPid(userPid): Observable<any> {
    return this.http.post(environment.baseApiUrl + '/Process/Console',{ pid: userPid }, { headers: new HttpHeaders({
        'Content-Type':  'application/json'
      }),
      withCredentials: true });
  }

  runCommand(pid, command): Observable<any> {
    return this.http.post(environment.baseApiUrl + '/Process/Command', { 'pid': pid, "command":command}, { headers: new HttpHeaders({
        'Content-Type':  'application/json'
      }),
      withCredentials: true });
  }

  killProcess(pid): Observable<any> {
    return this.http.post(environment.baseApiUrl + '/Process/Kill', { pid: pid }, { headers: new HttpHeaders({
        'Content-Type':  'application/json'
      }),
      withCredentials: true });
  }

  addPiDashApp(piDashApp): Observable<any> {
    return this.http.post(environment.baseApiUrl + '/App/AddApp', {json: JSON.stringify(piDashApp)}, { headers: new HttpHeaders({
        'Content-Type':  'application/json'
      }),
      withCredentials: true });
  }

  getUser(): Observable<any> {
    return this.http.post(environment.baseApiUrl + '/LogonRegister/User', '', { headers: new HttpHeaders({
        'Content-Type':  'application/json'
      }),
      withCredentials: true });
  }

  getPiDashApp(appId): Observable<any> {
    return this.http.post(environment.baseApiUrl + '/App/GetApp', '', { headers: new HttpHeaders({
        'Content-Type':  'application/json'
      }),
      withCredentials: true });
  }

  getPiDashApps(): Observable<any> {
    return this.http.post(environment.baseApiUrl + '/App/GetAppsByUserId', {},{ headers: new HttpHeaders({
        'Content-Type':  'application/json'
      }),
      withCredentials: true });
  }

  deletePiDashApp(appId): Observable<any> {
    return this.http.post(environment.baseApiUrl + '/App/DeleteAppByAppId', { "appId": appId}, { headers: new HttpHeaders({
        'Content-Type':  'application/json'
      }),
      withCredentials: true });
  }

  updatePiDashApp(piDashApp): Observable<any> {
    return this.http.post(environment.baseApiUrl + '/App/UpdateApp', {json: JSON.stringify(piDashApp)}, { headers: new HttpHeaders({
        'Content-Type':  'application/json'
      }),
      withCredentials: true });
  }

  saveScript(script): Observable<any> {
    return this.http.post(environment.baseApiUrl + '/App/SaveScript', {json: JSON.stringify(script)}, { headers: new HttpHeaders({
        'Content-Type':  'application/json'
      }),
      withCredentials: true });
  }

  getLogContents(log): Observable<any> {
    return this.http.post(environment.baseApiUrl + '/App/GetLogContents', {json: JSON.stringify(log)}, { headers: new HttpHeaders({
        'Content-Type':  'application/json'
      }),
      withCredentials: true });
  }

  deleteAppPermissionByPermissionId(permissionId, appId): Observable<any> {
    return this.http.post(environment.baseApiUrl + '/App/DeleteAppPermissionByPermissionId',
      { permissionId: permissionId, appId: appId }, { headers: new HttpHeaders({
          'Content-Type':  'application/json'
        }),
        withCredentials: true });
  }

  deleteAppLogByLogId(logId, appId): Observable<any> {
    return this.http.post(environment.baseApiUrl + '/App/DeleteAppLogByLogId', {logId : logId, appId: appId }, { headers: new HttpHeaders({
        'Content-Type':  'application/json'
      }),
      withCredentials: true });
  }

  startPiDashApp(piDashApp): Observable<any> {
     return this.http.post(environment.baseApiUrl + '/App/StartPiDashApp', {json: JSON.stringify(piDashApp)}, { headers: new HttpHeaders({
         'Content-Type':  'application/json'
       }),
       withCredentials: true});
  }
}
