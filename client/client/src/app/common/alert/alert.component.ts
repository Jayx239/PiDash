import { Component, OnInit } from '@angular/core';


@Component({
  selector: 'app-alert',
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.css']
})
export class AlertComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}

export interface IAlert {
  type: string;
  enabled: boolean;
  message: string;
  onClose();
  setCloseIn(timeout);
}
export class Alert implements IAlert {
  enabled: boolean;
  message: string;
  type: string;

  constructor(enabled: boolean, message: string, type: string) {
    this.enabled = enabled;
    this.message = message;
    this.type = type;
  }

  onClose() {
    this.enabled = false;
  }
  setCloseIn(timeout: number) {
    setTimeout(() => this.enabled = false, timeout);
  }
}
