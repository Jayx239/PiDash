import { Component, OnInit } from '@angular/core';
import {AccountService} from '../account.service';
import {Form} from '@angular/forms';
import {Alert, IAlert} from '../../common/alert/alert.component';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent implements OnInit {
  currentPassword: string;
  newPassword: string;
  repeatNewPassword: string;
  alert: IAlert;

  constructor(private accountService: AccountService) {
    this.alert = new Alert(false, '', '');
  }
  // "/Account/ChangePassword"
  ngOnInit() {
  }
  submitChangePassword(form: Form) {
    if (!this.currentPassword) {
      return false;
    }
    if (!this.newPassword || this.newPassword !== this.repeatNewPassword) {
      return false;
    }
    this.accountService.resetPassword(this.currentPassword, this.newPassword, this.repeatNewPassword).subscribe((response) => {
      if (response.successful) {
        this.alert.type = 'success';
        this.alert.message = response.message;
        this.alert.enabled = true;
        this.alert.setCloseIn(3000);
        // Show success message
      } else {
        // Show error message
        this.alert.type = 'danger';
        this.alert.message = response.message;
        this.alert.enabled = true;
        this.alert.setCloseIn(3000);
      }
    });
  }
}
