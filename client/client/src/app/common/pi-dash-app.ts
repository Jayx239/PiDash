/* Data Structures */

import {mergeScan} from 'rxjs/operators';

export class PiDashApp {
  // TODO: Create classes for these objects
  app: App;
  appPermissions: AppPermission[];
  process: PiDashProcess;
  pid: number;

  constructor(app, appPermissions, piDashProcess) {
    this.app = app;
    this.appPermissions = appPermissions;
    if (piDashProcess) {
      this.process = piDashProcess;
      this.pid = piDashProcess.pid;
    } else {
      this.process = new PiDashProcess(-1, -1, []);
      this.process.running = false;
    }
  }

  setAppId(appId: number) {
    this.app.appId = appId;
    for (const log of this.app.logs) {
      log.appId = appId;
    }
  }

}

export class App {
  name: string;
  appId: number;
  creatorUserId: string;
  logs: any; // TODO: Crate logs object
  startCommand: string;
  constructor(name, appId, creatorUserId, startCommand, logs) {
    this.name = name;
    this.appId = appId;
    this.creatorUserId = creatorUserId;
    this.startCommand = startCommand;
    this.logs = logs;
  }
}

export class AppLog {

  id: number;
  appId: number;
  path: string;
  name: string;

  constructor(logId, appId, path, name) {
    this.id = logId;
    this.appId = appId;
    this.path = path;
    this.name = name;
  }
}

export class AppPermission {

  permissionId: number;
  appId: number;
  appUser: AppUser;
  groupId: number;
  read: number;
  write: number;
  execute: number;

  constructor(permissionId, appId, appUser, groupId, read, write, execute) {
    this.permissionId = permissionId;
    this.appId = appId;
    this.appUser = appUser;
    this.groupId = groupId;
    this.read = read;
    this.write = write;
    this.execute = execute;
  }
}

export class AppUser {
  userName: string;
  userId: number;

  constructor(userName, userId) {
    this.userName = userName;
    this.userId = userId;
  }
}

export class PiDashProcess {
  pid: number;
  messages: any[]; // TODO: is this string[]?
  running: boolean;
  startTime: number;

  constructor(pid: number, startTime: number, messages) {
    this.pid = pid;
    this.messages = [];
    if (pid && pid >= 0) {
      this.running = true;
    } else {
      this.running = false;
    }

    if (messages) {
      this.messages = messages;
      this.isRunning();
    }

    this.startTime = Date.now();
    if (startTime) {
      this.startTime = startTime;
    }
  }

  isRunning() {
    if (this.running) {
      for (let i = 0; i < this.messages.length; i++) {
        if (this.messages[i].Source === CLOSE ) {
          this.running = false;
          break;
        }
      }
    }

    return this.running;
  }
}

/* Console signal codes */
const STDIN = 'stdin'; // 0;
const STDOUT = 'stdout'; // 1;
const STDERR = 'stderr'; // 2;
const CLOSE = 'close'; // 3;

export class Process {

  process;
  pid: number;
  messages;
  startTime: number;
  endTime: number;

  constructor(process, startTime) {
    this.process = process;
    this.pid = process.pid;
    this.messages = [];
    this.startTime = Date.now();
    if (startTime) {
      this.startTime = startTime;
    }
  }
  stopProcess() {
    this.endTime = Date.now();
  }

  getUpTime() {
    if (this.endTime) {
      return this.endTime - this.startTime;
    } else {
      return Date.now() - this.startTime;
    }
  }

  writeIn(input) {
    this.process.stdin.write(input);
    this.messages.push(new ProcessMessage(STDIN, input));
  }
  writeErr(input) {
    this.messages.push(new ProcessMessage(STDERR, input));
  }
  writeOut(input) {
    this.messages.push(new ProcessMessage(STDOUT, input));
  }
  writeClose(input) {
    this.messages.push(new ProcessMessage(CLOSE, input));
  }
}

export class ProcessMessage {
  // TODO: fix style
  Source;
  Message;
  CreateTime;
  constructor(src, message) {
    this.Source = src;
    this.Message = message;
    this.CreateTime = Date.now();
  }
}


export class PiDashAppFactory {

  static buildPiDashAppFromResponse(res) {

    const jsonRes = this.tryParseJson(res);

    const app = this.buildAppFromResponse(jsonRes);
    let permissions;
    let process;

    if (jsonRes.appPermissions) {
      permissions = this.buildPermissionsFromResponse(jsonRes);
    }
    if (jsonRes.process) {
      process = new PiDashProcess(jsonRes.process.pid, jsonRes.process.startTime, jsonRes.process.messages);
    }

    const dashApp = new PiDashApp(app, permissions, process);

    if (jsonRes.pid) {
      dashApp.pid = jsonRes.pid;
    }



    return dashApp;
  }

  static buildPiDashAppsFromResponse(res) {
    console.log(res);
    const jsonRes = this.tryParseJson(res);
    const piDashApps = new Object();
    for (let i = 0; i < jsonRes.apps.length; i++) {
      const piDashApp = this.buildPiDashAppFromResponse(jsonRes.apps[i]);
      piDashApps[piDashApp.app.appId] = piDashApp;
    }
    return piDashApps;
  }

  static buildAppFromResponse(res) {
    if (res) {
      const logs = this.buildLogsFromResponse(res);
      const app = new App(res.app.name, res.app.appId, res.app.creatorUserId, res.app.startCommand, logs);
      return app;
    } else {
      return null;
    }

  }

  static buildLogsFromResponse(res) {
    const logs = [];
    for (let i = 0; i < res.app.logs.length; i++) {
      const log = res.app.logs[i];
      logs.push(new AppLog(log.id, res.app.appId, log.path, log.name));
    }
    return logs;
  }

  static buildPermissionsFromResponse(res) {
    const permissions = [];
    for (let i = 0; i < res.appPermissions.length; i++) {
      const permission = res.appPermissions[i];
      if (permission && permission.appUser) {
        permissions.push(new AppPermission(permission.permissionId, res.app.appId,
          new AppUser(permission.appUser.userName, permission.appUser.userId),
          permission.groupId, permission.read, permission.write, permission.execute));
      }
    }
    return permissions;
  }

  static buildProcessesFromResponse(res) {
    const processes = [];

    for (let i = 0; i < res.processes.length; i++) {
      const process = res.processes[i];
      processes.push(new Process(process.pid, process.startTime));
    }
    return processes;
  }

  static createDefaultPiDashApp(userName, userId) {
    const app = new App('', -1, userId, '', []);
    const appUser = new AppUser(userName, userId);
    const appPermissions = [new AppPermission(-1, -1, appUser, -1, true, true, true)];
    const piDAshApp = new PiDashApp(app, appPermissions, null);
    return piDAshApp;
  }

  static tryParseJson(res) {
    let jsonRes;
    if ((typeof res) === 'string') {
      jsonRes = JSON.parse(res);
    } else {
      jsonRes = res;
    }

    return jsonRes;

  }

}
