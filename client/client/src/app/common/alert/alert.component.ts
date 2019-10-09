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
  close();
  show(message: string, type: string);
  setCloseIn(timeout);
  showFor(message: string, type: string, timeout: number);
}
export class Alert implements IAlert {
  enabled: boolean;
  message: string;
  type: string;
  timeout: number;

  constructor(enabled: boolean, message: string, type: string) {
    this.enabled = enabled;
    this.message = message;
    this.type = type;
    this.timeout = 3000;
  }

  close() {
    this.enabled = false;
  }
  show(message: string, type: string) {
    if (message) {
      this.message = message;
    }
    if (type) {
      this.type = type;
    }
    this.enabled = true;
  }
  setCloseIn(timeout: number) {
    if (this.timeout) {
      clearTimeout(this.timeout);
    }
    this.timeout = setTimeout(() => this.close(), timeout);
  }

  showFor(message: string, type: string, timeout: number) {
    if (message) {
      this.message = message;
    }
    if (type) {
      this.type = type;
    }
    if (timeout) {
      this.timeout = timeout;
    }
    this.show(this.message, this.type);
    this.setCloseIn(this.timeout);
  }
}
