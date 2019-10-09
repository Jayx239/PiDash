import { Component, OnInit } from '@angular/core';
import {AppLog} from '../../common/pi-dash-app';
import {ServerManagerService} from '../server-manager.service';

@Component({
  selector: 'app-log-configuration',
  templateUrl: './log-configuration.component.html',
  styleUrls: ['./log-configuration.component.css']
})
export class LogConfigurationComponent implements OnInit {
  activeAppLogs: AppLog[];
  activeAppId: number;
  constructor(private serverManagerService: ServerManagerService) { }

  ngOnInit() {
  }

  deleteActiveAppLog(index) {
    this.serverManagerService.deleteAppLogByLogId(this.activeAppLogs[index].id,
      this.activeAppId).subscribe(() => {
      this.activeAppLogs.splice(index, 1);
    });
  }
  addActiveAppLog() {
    if (!this.activeAppLogs) {
      this.activeAppLogs = [];
    }
    this.activeAppLogs.push(new AppLog(-1, this.activeAppId, '', ''));
  }


}
