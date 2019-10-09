import {Component, Input, OnInit} from '@angular/core';
import {PiDashApp} from '../../common/pi-dash-app';
import {NgForm} from '@angular/forms';

@Component({
  selector: 'app-app-configuration',
  templateUrl: './app-configuration.component.html',
  styleUrls: ['./app-configuration.component.css']
})
export class AppConfigurationComponent implements OnInit {
  @Input() activeApp: PiDashApp;
  constructor() { }

  ngOnInit() {
  }

}
