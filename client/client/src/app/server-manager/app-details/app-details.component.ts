import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {PiDashApp} from '../../common/pi-dash-app';

@Component({
  selector: 'app-app-details',
  templateUrl: './app-details.component.html',
  styleUrls: ['./app-details.component.css']
})
export class AppDetailsComponent implements OnInit {
  @Input() activeApp: PiDashApp;

  @Output() toggleActiveAppStartClicked: EventEmitter<any>;
  @Output() deleteActiveAppClicked: EventEmitter<any>;
  @Input() startAppButtonText: string;
  @Input() deleteAppButtonText: string;

  constructor() {
    this.toggleActiveAppStartClicked = new EventEmitter<any>();
    this.deleteActiveAppClicked = new EventEmitter<any>();

  }

  ngOnInit() {
  }

  toggleActiveAppStart() {
    this.toggleActiveAppStartClicked.emit();
  }
  deleteActiveApplication() {
    this.deleteActiveAppClicked.emit();
  }
}
