import { Component, OnInit } from '@angular/core';
import { LogonService } from './logon.service';
import {Router} from '@angular/router';
import {Alert, IAlert} from '../common/alert/alert.component';
import {AuthService, User} from "../common/auth.service";

@Component({
  selector: 'app-logon',
  templateUrl: './logon.component.html',
  styleUrls: ['./logon.component.css']
})
export class LogonComponent implements OnInit {

  userName: string;
  password: string;
  alert: IAlert;
  constructor(private logonService: LogonService, private router: Router, private authService: AuthService) {
    this.alert = new Alert(false, '', 'danger');
  }

  ngOnInit() {

  }

  logon() {

    this.logonService.logon(this.userName, this.password).subscribe((response) => {
      if (response.successful) {
        // redirect
        this.router.navigate(['dash/dashboard']);
      } else {
        // display errors
        this.alert.message = 'Logon failed, please try again';
        this.alert.type = 'danger';
        this.alert.enabled = true;
        this.alert.setCloseIn(5000);
      }
    }, (response) => {
      this.alert.type = 'danger';
      this.alert.message = 'Logon failed, please try again';
      this.alert.enabled = true;
      this.alert.setCloseIn(5000);
      }, () => {});
  }

  navigateToRegister() {
    this.router.navigate(['register']);
  }
}
