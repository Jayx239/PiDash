import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {PiDashApp, PiDashAppFactory} from '../../common/pi-dash-app';

@Component({
  selector: 'app-app-list',
  templateUrl: './app-list.component.html',
  styleUrls: ['./app-list.component.css']
})
export class AppListComponent implements OnInit {
  @Input() piDashApps: PiDashApp[];
  @Input() activeApp: PiDashApp;
  @Output() addAppClicked: EventEmitter<any>;
  @Output() setActiveAppClicked: EventEmitter<any>;

  constructor() {
    this.addAppClicked = new EventEmitter();
    this.setActiveAppClicked = new EventEmitter();
  }

  ngOnInit() {
  }

  setActiveApp(piDashAppId) {
    this.setActiveAppClicked.emit(piDashAppId);
  }
  addApplication() {
    this.addAppClicked.emit('ADDAPP');
  }
  appList(piDashApps): PiDashApp[] {
    const appList: PiDashApp[] = [];
    for(const app of piDashApps) {
      if (app) {
        appList.push(app);
      }
    }
    return appList;
  }
}
