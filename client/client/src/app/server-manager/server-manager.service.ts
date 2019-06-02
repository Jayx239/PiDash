import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ServerManagerService {

  constructor(private http: HttpClient) { }

  /* Methods */
  spawnProcess(userCommand): Observable<any> {
    return this.http.post(environment.baseApiUrl + '/Process/Spawn', {Command: userCommand}, {withCredentials: true});
  }

  getConsoleByPid(userPid): Observable<any> {
    return this.http.post(environment.baseApiUrl + '/Process/Console',{ pid: userPid }, { withCredentials: true });
  }

  runCommand(pid, command): Observable<any> {
    return this.http.post(environment.baseApiUrl + '/Process/Command', { 'pid': pid, "command":command}, { withCredentials: true });
  }

  killProcess(pid): Observable<any> {
    return this.http.post(environment.baseApiUrl + '/Process/Kill', { 'pid': pid }, { withCredentials: true });
  }

  addPiDashApp(piDashApp): Observable<any> {
    return this.http.post(environment.baseApiUrl + '/App/AddApp', {json: JSON.stringify(piDashApp)}, { withCredentials: true });
  }

  getUser(): Observable<any> {
    return this.http.post(environment.baseApiUrl + '/LogonRegister/User', '', { withCredentials: true });
  }

  getPiDashApp(appId): Observable<any> {
    return this.http.post(environment.baseApiUrl + '/App/GetApp', '', { withCredentials: true });
  }

  getPiDashApps(): Observable<any> {
    return this.http.post(environment.baseApiUrl + '/App/GetAppsByUserId', { withCredentials: true });
  }

  deletePiDashApp(appId): Observable<any> {
    return this.http.post(environment.baseApiUrl + '/App/DeleteAppByAppId', { "appId": appId}, { withCredentials: true });
  }

  updatePiDashApp(piDashApp): Observable<any> {
    return this.http.post(environment.baseApiUrl + '/App/UpdateApp', {json: JSON.stringify(piDashApp)}, { withCredentials: true });
  }

  saveScript(script): Observable<any> {
    return this.http.post(environment.baseApiUrl + '/App/SaveScript', {json: JSON.stringify(script)}, { withCredentials: true });
  }

  getLogContents(log): Observable<any> {
    return this.http.post(environment.baseApiUrl + '/App/GetLogContents', {json: JSON.stringify(log)}, { withCredentials: true });
  }

  deleteAppPermissionByPermissionId(permissionId, appId): Observable<any> {
    return this.http.post(environment.baseApiUrl + '/App/DeleteAppPermissionByPermissionId',
      { permissionId: permissionId, appId: appId }, { withCredentials: true });
  }

  deleteAppLogByLogId(logId, appId): Observable<any> {
    return this.http.post(environment.baseApiUrl + '/App/DeleteAppLogByLogId', {logId : logId, appId: appId }, { withCredentials: true });
  }

  startPiDashApp(piDashApp): Observable<any> {
     return this.http.post(environment.baseApiUrl + '/App/StartPiDashApp', {json: JSON.stringify(piDashApp)}, {withCredentials: true});
  }
}
