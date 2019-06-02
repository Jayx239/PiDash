import {Component, Input, OnInit} from '@angular/core';
import {PiDashApp} from '../../common/pi-dash-app';

@Component({
  selector: 'app-app-details',
  templateUrl: './app-details.component.html',
  styleUrls: ['./app-details.component.css']
})
export class AppDetailsComponent implements OnInit {
  @Input() activeApp: PiDashApp;
  startAppButtonText = 'Start App';
  deleteAppButtonText = 'Delete App';

  constructor() { }

  ngOnInit() {
  }

}
