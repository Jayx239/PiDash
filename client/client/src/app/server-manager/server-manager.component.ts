import { Component, OnInit } from '@angular/core';
import {ServerManagerService} from './server-manager.service';
import {AppLog, AppPermission, AppUser, PiDashApp, PiDashAppFactory} from '../common/pi-dash-app';
import {debug} from 'util';
import {interval, Observable, timer} from 'rxjs';
import {NavigationStart, Router} from '@angular/router';
import {Alert, IAlert} from '../common/alert/alert.component';
import {AuthService} from "../common/auth.service";

@Component({
  selector: 'app-server-manager',
  templateUrl: './server-manager.component.html',
  styleUrls: ['./server-manager.component.css']
})
export class ServerManagerComponent implements OnInit {

  refreshRate: number;
  processes: any[];
  apps: any[];
  piDashApps: PiDashApp[];
  activeApp: PiDashApp;
  activeAppPermissions: any[];
  activeAppLogs: any[];
  activeAppIndex: number;
  command: string;
  startAppButtonText = 'Start App';
  deleteAppButtonText = 'Delete App';
  userId: string;
  userName: string;
  appUser: any;
  selectedConfigMenu: string;
  configMenus = {
    App: 'App',
    Permissions: 'Permissions',
    Log: 'Log'
  };
  isAdmin: boolean;
  maxNewApps = 100;

  Statuses = {Starting: 'Starting', Running: 'Running', Stopped: 'Stopped', Loading: 'Loading'};
  MessageSourceTypes = {Out: 'stdout', In: 'stdin', Error: 'stderr', Close: 'close'};

  refreshTimer;
  alert: IAlert;
  alertTimeout;
  constructor(private serverManagerService: ServerManagerService, private router: Router, private authService: AuthService) {
    this.refreshRate = 1000; // ms, TODO: abstract this
    this.processes = [];
    this.apps = [];
    this.piDashApps = [];
    // this.activeApp = PiDashAppFactory.createDefaultPiDashApp();
    this.activeAppPermissions = [];
    this.activeAppLogs = [];
    this.activeAppIndex = 0;
    this.command = '';
    this.startAppButtonText = 'Start App';
    this.deleteAppButtonText = 'Delete App';
    this.userId = '';
    this.userName = '';
    // this.appUser;
    // this.selectedConfigMenu;
    this.maxNewApps = 100;
    this.alert = new Alert(false, '', 'danger');
    this.alertTimeout = 5000;
  }

  setMenu(menuId) {
    this.selectedConfigMenu = menuId;
  }


  ngOnInit() {
    this.serverManagerService.getUser().subscribe((res) => {
      this.userId = res.userId;
      this.userName = res.userName;
      this.isAdmin = res.isAdmin;
      this.appUser = new AppUser(this.userName, this.userId);
      this.retrieveApps();
      this.selectedConfigMenu = this.configMenus.App;
      this.refreshTimer = timer(this.refreshRate, 1000).subscribe(() => {
        if (!this.activeApp) {
          return;
        }
        if (this.activeApp.status === this.Statuses.Running ) {
          this.refreshConsole(this.activeApp);
          if (!this.piDashApps[this.activeApp.appId].process.isRunning()) {
            this.activeApp.status = this.Statuses.Stopped;
          }
        }
      });
      this.router.events.subscribe((event) => {
        if (event instanceof NavigationStart) {
          this.refreshTimer.kill();
        }
      });
    });
  }

/* $interval(function() {
    if (this.activeApp.status === this.Statuses.Running ) {
      this.refreshConsole(activeApp);
      if (!this.piDashApps[this.activeApp.appId].process.isRunning()) {
        this.activeApp.status = this.Statuses.Stopped;
      }
    }
  }, refreshRate);
*/

getNextNewAppId() {
    let i;
    for (i = -1; i > -this.maxNewApps; i--) {
      if (this.piDashApps[i]) {
        continue;
      }
      return i;
    }
    return i;
  }

setActiveApp(index) {
    this.activeApp = this.piDashApps[index];

    if (!this.activeApp.messages) {
      this.activeApp.messages = [];
    }
    if (!this.activeApp.status) {
      this.activeApp.status = this.Statuses.Stopped;
    }
    this.activeApp.pid = this.piDashApps[this.activeApp.appId].pid;
    if (!this.piDashApps[index].appPermissions) {
      this.piDashApps[index].appPermissions = [];
    }
    this.activeAppPermissions = this.piDashApps[index].appPermissions;

    if (!this.piDashApps[index].app.logs) {
      this.piDashApps[index].app.logs = [];
    }

    this.activeAppLogs = this.piDashApps[index].app.logs;
    if (this.piDashApps[index].process && this.piDashApps[index].process.isRunning()) {
      this.activeApp.status = this.Statuses.Running;
    } else {
      this.activeApp.status = this.Statuses.Stopped;
    }

    this.updateStartButton();
  }

addApplication() {
    const newPiDashApp = PiDashAppFactory.createDefaultPiDashApp(this.userName, this.userId); // TODO: Add to a service
    newPiDashApp.app.appId = this.getNextNewAppId();
    newPiDashApp.app.name = 'New App';
    this.piDashApps[newPiDashApp.app.appId] = newPiDashApp;
    this.setActiveApp(newPiDashApp.app.appId);
    // console.log(apps.length + ' ' + this.activeApp.name);
}

deleteActiveApplication() {
    this.serverManagerService.deletePiDashApp(this.activeApp.appId).subscribe((response) => {
      if (response.status === 'Success') {
        this.deleteActiveAppLocally();
        this.showSuccessMessage(response.message);
      } else {
        this.showErrorMessage(response.message);
      }

    });
  }

deleteActiveAppLocally() {
  this.deleteAppLocally(this.activeApp.appId);
}

deleteAppLocally(appId) {
    delete this.piDashApps[appId];
}

deleteApplication(appId) {
    delete this.piDashApps[appId];
  }

saveApplication() {
    this.apps.push({ ...this.activeApp });
  }

refreshApps() {
    this.refreshConsoles();
  }

refreshConsoles() {
    for (const app in this.piDashApps) {
      this.refreshConsole(app);
    }
  }

isStopped(messages) {
    for (let i = 0; i < messages.length; i++) {
      console.log(messages[i].Source);
      if (messages[i].Source ===  this.MessageSourceTypes.Close) {
        return true;
      }
    }
    return false;
  }

refreshConsole(app) {
    this.serverManagerService.getConsoleByPid(app.pid).subscribe((response) => {
      if (response.Status !== 'Error') {
        app.console = this.formatMessageOutput(response); // Use filter?
      }

      if (this.isStopped(response)) {
        app.status = this.Statuses.Stopped;
      } else {
        app.status = this.Statuses.Running;
      }
      this.updateStartButton();
    });
  }

spawnProcess(app) {
    app.status = this.Statuses.Starting;
    this.serverManagerService.spawnProcess(app.startCommand).subscribe((response) => {
      app.status = this.Statuses.Running;
      if (response) {
        app.pid = response.Pid;
        this.refreshConsole(app);
      }
    });
  }

formatMessageOutput(messages) {
    let output = '';
    for (let i = 0; i < messages.length; i++) {
      output += messages[i].Message;
    }
    return output;
  }

  /*
executeCommand(app, command) {
    this.serverManagerService.runCommand(app.pid, command);
  }

executeCommandActive(command) {
//    this.executeCommand(this.activeApp, command).subscribe((response) => {
  //    this.refreshConsole(this.activeApp);
    // });
  }
*/
updateStartButton() {
    if (this.activeApp.status === this.Statuses.Running) {
      this.startAppButtonText = 'Stop App';
    } else {
      this.startAppButtonText = 'Start App';
    }
  }

toggleActiveAppStart() {
    if (this.activeApp.status === this.Statuses.Stopped) {
      this.startActivePiDashApp();
    } else {
      this.stopActiveApp();
    }
    this.updateStartButton();
  }

startActiveApp() {
    this.spawnProcess(this.activeApp);

  }

stopActiveApp() {
    this.killApp(this.activeApp);
  }

killApp(app) {
  this.serverManagerService.killProcess(app.pid).subscribe(() => {
      this.refreshConsole(app);
    });
  }

retrieveApps() {
  this.serverManagerService.getPiDashApps().subscribe((res) => {

    if (res) {
        const userApps = PiDashAppFactory.buildPiDashAppsFromResponse(res);
        if (userApps) {
          for ( const i in userApps) {
            this.piDashApps[userApps[i].app.appId] = userApps[i];
          }
        }
      }
    });
  }

addPiDashApp() {
    const activePiDashApp = this.piDashApps[this.activeApp.appId];
    if (activePiDashApp.app.appId <= 0) {
      this.serverManagerService.addPiDashApp(activePiDashApp).subscribe((res) => {
      delete this.piDashApps[activePiDashApp.app.appId];
      this.retrieveApps();
      this.showSuccessMessage('App Added!');
    });
    } else {
      this.updatePiDashApp(activePiDashApp);
    }
  }

updatePiDashApp(piDashApp) {
  this.serverManagerService.updatePiDashApp(piDashApp).subscribe((res) => {
      if (res.app) {
        this.piDashApps[this.activeApp.appId] = PiDashAppFactory.buildPiDashAppFromResponse(res.app);
        this.showSuccessMessage('App updated!');
      }
      if ( res.status === 'Error') {
        this.showErrorMessage(res.message);
      } else {
        this.showSuccessMessage(res.message);
      }
      this.setActiveApp(this.activeApp.appId);
    });
  }

startActivePiDashApp() {
this.startPiDashApp(this.activeApp.appId);
}

startPiDashApp(appId) {
  this.activeApp.status = this.Statuses.Starting;
  return this.serverManagerService.startPiDashApp(appId).subscribe((response: string) => {
      const piDashAppRes = JSON.parse(response);
      if (piDashAppRes.status === 'Error') {
        this.activeApp.status = this.Statuses.Stopped;
        this.setActiveApp(appId);
        this.showErrorMessage(piDashAppRes.message);
      } else if (piDashAppRes.piDashApp) {
        const updatedPiDashApp: PiDashApp = PiDashAppFactory.buildPiDashAppFromResponse(piDashAppRes.piDashApp);
        if (updatedPiDashApp) {
          this.piDashApps[updatedPiDashApp.appId] = updatedPiDashApp;
        }
        this.setActiveApp(updatedPiDashApp.appId);
        this.activeApp.status = this.Statuses.Running;
      }
      return response;
    });
  }
  /*resetPermissionUserId(appPermission) {
    appPermission.appUser.userId = -1;
  }*/
  showErrorMessage(message) {
    this.alert.message = message;
    this.alert.type = 'danger';
    this.alert.enabled = true;
    this.alert.setCloseIn(this.alertTimeout);
  }

  showSuccessMessage(message) {
    this.alert.message = message;
    this.alert.type = 'success';
    this.alert.enabled = true;
    this.alert.setCloseIn(this.alertTimeout);
  }

  buildPiDashAppFromResponse(app): any {
    return {};
  }
}
