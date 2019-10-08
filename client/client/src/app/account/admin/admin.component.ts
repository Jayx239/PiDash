import { Component, OnInit } from '@angular/core';
import {NgForm} from '@angular/forms';
import {AccountService} from '../account.service';
import {Alert, IAlert} from '../../common/alert/alert.component';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {


  newAdminName: string;
  alert: IAlert;
  constructor(private accountService: AccountService) {
    this.newAdminName = '';
    this.alert = new Alert(false, '', 'danger');
  }


  ngOnInit() {
  }

  submitForm() {
    if (!this.newAdminName) {
      return;
    }
    this.accountService.grantAdminPrivileges(this.newAdminName).subscribe((response) => {
          this.alert.type = 'success';
          this.alert.message = response.message; // this.alert.message = 'Admin priviliges granted';
          this.alert.enabled = true;
      }, (error) => {
          this.alert.type = 'danger';
          this.alert.message = error.message;
          this.alert.enabled = true;
      },
        () => { });
  }
}

