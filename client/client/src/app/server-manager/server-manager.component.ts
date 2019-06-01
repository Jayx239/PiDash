import { Component, OnInit } from '@angular/core';
import {ServerManagerService} from './server-manager.service';
import {AppLog, AppPermission, AppUser, PiDashAppFactory} from '../common/pi-dash-app';

@Component({
  selector: 'app-server-manager',
  templateUrl: './server-manager.component.html',
  styleUrls: ['./server-manager.component.css']
})
export class ServerManagerComponent implements OnInit {

  refreshRate: number;
  processes: any[];
  apps: any[];
  piDashApps: any;
  activeApp: any;
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

  maxNewApps = 100;

  Statuses = {Starting: 'Starting', Running: 'Running', Stopped: 'Stopped', Loading: 'Loading'};
  MessageSourceTypes = {Out: 'stdout', In: 'stdin', Error: 'stderr', Close: 'close'};

  constructor(private serverManagerService: ServerManagerService) {
    this.refreshRate = 1000; // ms, TODO: abstract this
    this.processes = [];
    this.apps = [];
    this.piDashApps = new Object();
    this.activeApp = [];
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

  }

  setMenu(menuId) {
    this.selectedConfigMenu = menuId;
  }


  ngOnInit() {
    this.serverManagerService.getUser().subscribe((res) => {
      this.userId = res.userId;
      this.userName = res.userName;
      this.appUser = new AppUser(this.userName, this.userId);
      this.retrieveApps();
      this.selectedConfigMenu = this.configMenus.App;
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
    this.activeApp = this.piDashApps[index].app;

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
        alert('App Deleted');
      } else {
        alert('Error Deleting App');
      }

    });
  }

deleteActiveAppLocally() {
  this.deleteAppLocally(this.activeApp.appId);
}

deleteAppLocally(appId) {
    delete this.piDashApps[appId];
}

/*deleteApplication() {
    delete this.piDashApps[this.appId];
  }*/

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
    for(const app in this.piDashApps) {
      this.refreshConsole(app);
    }
  }

isStopped(messages) {
    for(let i = 0; i < messages.length; i++) {
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
    for(let i = 0; i < messages.length; i++) {
      output += messages[i].Message;
    }
    return output;
  }

executeCommand(app, command) {
    this.serverManagerService.runCommand(app.pid, command);
  }

executeCommandActive(command) {
//    this.executeCommand(this.activeApp, command).subscribe((response) => {
  //    this.refreshConsole(this.activeApp);
    // });
  }

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
          for( const i in userApps) {
            this.piDashApps[userApps[i].app.appId] = userApps[i];
          }
        }
      }
    });
  }

/*addPiDashApp() {
    const activePiDashApp = this.piDashApps[this.activeApp.appId];
    if (activePiDashApp.app.appId <= 0) {
      this.addPiDashApp(activePiDashApp);
    } else {
      this.updatePiDashApp(activePiDashApp);
    }
  }
*/
addPiDashApp(piDashApp) {
  this.serverManagerService.addPiDashApp(piDashApp).subscribe((res) => {
      delete this.piDashApps[piDashApp.app.appId];
      this.retrieveApps();
      alert('App Added!');
    });
  }

updatePiDashApp(piDashApp) {
  this.serverManagerService.updatePiDashApp(piDashApp((res) => {
      if (res.app) {
        this.piDashApps[this.activeApp.appId] = this.buildPiDashAppFromResponse(res.app);
      }
      this.setActiveApp(this.activeApp.appId);
    }));
  }

addActiveAppPermission() {
    if (!this.activeAppPermissions) {
      this.activeAppPermissions = [];
    }
    this.activeAppPermissions.push(new AppPermission(-1, this.activeApp.appId, new AppUser('', -1), -1, false, false, false));
  }

deleteActiveAppPermission(index) {
    this.serverManagerService.deleteAppPermissionByPermissionId
    (this.piDashApps[this.activeApp.appId].appPermissions[index].permissionId, this.activeApp.appId).subscribe(() => {
      this.activeAppPermissions.splice(index, 1);
    });
  }

addActiveAppLog() {
    if (!this.activeAppLogs) {
      this.activeAppLogs = [];
    }
    this.activeAppLogs.push(new AppLog(-1, this.activeApp.appId, '', ''));
  }

deleteActiveAppLog(index) {
  this.serverManagerService.deleteAppLogByLogId(this.piDashApps[this.activeApp.appId].app.logs[index].id,
    this.activeApp.appId).subscribe(() => {
      this.piDashApps[this.activeApp.appId].app.logs.splice(index, 1);
    });
  }

startActivePiDashApp() {
  // this.startPiDashApp(this.activeApp.appId).subscribe((response) {
    //  console.log(response);
    // });
  }

startPiDashApp(appId, callback) {
  this.activeApp.status = this.Statuses.Starting;
  this.serverManagerService.startPiDashApp(this.piDashApps[appId]).subscribe((response) => {

      const piDashAppRes = JSON.parse(response);
      if (piDashAppRes.piDashApp) {
        const updatedPiDashApp = this.buildPiDashAppFromResponse(piDashAppRes.piDashApp);
        if (updatedPiDashApp) {
          this.piDashApps[updatedPiDashApp.app.appId] = updatedPiDashApp;
        }
        this.setActiveApp(updatedPiDashApp.app.appId);
        this.activeApp.status = this.Statuses.Running;
      } else if (piDashAppRes.Status === 'Error') {

      }
      if (callback) {
        callback(response);
      }
    });
  }
  resetPermissionUserId(appPermission) {
    appPermission.appUser.userId = -1;
  }

  buildPiDashAppFromResponse(app): any {
    return {};
  }
}
