import { Component, OnInit } from '@angular/core';
import { LogonService } from './logon.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-logon',
  templateUrl: './logon.component.html',
  styleUrls: ['./logon.component.css']
})
export class LogonComponent implements OnInit {

  userName: string;
  password: string;

  constructor(private logonService: LogonService, private router: Router) { }

  ngOnInit() {

  }

  logon() {
    this.logonService.logon(this.userName, this.password).subscribe((response) => {
      if (response.successful) {
        // redirect
        this.router.navigate(['/dashboard']);
      } else {
        // display errors
      }
    }, (response) => {}, () => {});
  }

  navigateToRegister() {
    this.router.navigate(['/register']);
  }
}
