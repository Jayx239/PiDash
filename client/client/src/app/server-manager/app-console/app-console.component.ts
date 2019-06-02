import {Component, Input, OnInit} from '@angular/core';
import {PiDashApp} from '../../common/pi-dash-app';
import {ServerManagerService} from '../server-manager.service';

@Component({
  selector: 'app-app-console',
  templateUrl: './app-console.component.html',
  styleUrls: ['./app-console.component.css']
})
export class AppConsoleComponent implements OnInit {

  @Input() activeApp: PiDashApp;
  command: string;
  constructor(private serverManagerService: ServerManagerService) { }

  ngOnInit() {
  }
  executeCommandActive(command) {
    //    this.executeCommand(this.activeApp, command).subscribe((response) => {
    //    this.refreshConsole(this.activeApp);
    // });
  }
  executeCommand(app, command) {
    this.serverManagerService.runCommand(app.pid, command);
  }

  refreshConsole(activeApp: PiDashApp) {
  }
}
