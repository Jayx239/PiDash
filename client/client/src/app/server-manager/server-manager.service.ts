import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ServerManagerService {

  constructor(private http: HttpClient) { }
  /* Variables */
  baseUrl = 'localhost:4656';

  /* Methods */
  spawnProcess = function(userCommand) {
    return this.http.post(environment.baseApiUrl + '/Process/Spawn', {Command: userCommand}, {withCredentials: true});
  };

  getConsoleByPid = function(userPid) {
    return this.http.post(environment.baseApiUrl + 'Process/Console',{ pid: userPid }, { withCredentials: true });
  };

  runCommand = function(pid, command, callback) {
    return this.http.post(environment.baseApiUrl + '/Process/Command', { 'pid': pid, "command":command}, { withCredentials: true });
  };

  killProcess = function(pid) {
    return this.http.post(environment.baseApiUrl + '/Process/Kill', { 'pid': pid }, { withCredentials: true });
  };

  addPiDashApp = function(piDashApp) {
    return this.http.post(environment.baseApiUrl + '/App/AddApp', {json: JSON.stringify(piDashApp)}, { withCredentials: true });
  };

  getUser = function() {
    return this.http.post(environment.baseApiUrl + '/LogonRegister/User', '', { withCredentials: true });
  };

  getPiDashApp = function(appId) {
    return this.http.post(environment.baseApiUrl + '/App/GetApp','', { withCredentials: true });
  };

  getPiDashApps = function() {
    return this.http.post(environment.baseApiUrl + '/App/GetAppsByUserId', { withCredentials: true });
  };

  deletePiDashApp = function(appId) {
    return this.http.post(environment.baseApiUrl + '/App/DeleteAppByAppId', { "appId": appId}, { withCredentials: true });
  };

  updatePiDashApp = function(piDashApp) {
    return this.http.post(environment.baseApiUrl + '/App/UpdateApp', {json: JSON.stringify(piDashApp)}, { withCredentials: true });
  };

  saveScript = function(script) {
    return this.http.post(environment.baseApiUrl + '/App/SaveScript', {json: JSON.stringify(script)}, { withCredentials: true });
  };

  getLogContents = function(log) {
    return this.http.post(environment.baseApiUrl + '/App/GetLogContents', {json: JSON.stringify(log)}, { withCredentials: true });
  };

  deleteAppPermissionByPermissionId = function(permissionId, appId) {
    return this.http.post(environment.baseApiUrl + '/App/DeleteAppPermissionByPermissionId',
      { permissionId: permissionId, appId: appId }, { withCredentials: true });
  };

  deleteAppLogByLogId = function(logId, appId) {
    return this.http.post(environment.baseApiUrl + /App/DeleteAppLogByLogId, {logId : logId, appId: appId }, { withCredentials: true });
  };

  startPiDashApp = function(piDashApp) {
    return this.http.post(environment.baseApiUrl + '/App/StartPiDashApp', {json: JSON.stringify(piDashApp)}, { withCredentrials: true })
  };
}
