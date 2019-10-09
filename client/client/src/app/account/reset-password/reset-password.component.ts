import { Component, OnInit } from '@angular/core';
import {AccountService} from '../account.service';
import {Form} from '@angular/forms';
import {Alert, IAlert} from '../../common/alert/alert.component';
import {NgbAlert} from '@ng-bootstrap/ng-bootstrap';

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
      this.alert.type = 'danger';
      this.alert.message = 'You must enter your current password';
      this.alert.enabled = true;
      return false;
    }
    if (!this.newPassword) {
      this.alert.type = 'danger';
      this.alert.message = 'Please enter and your new password';
      this.alert.enabled = true;
      return false;
    }

    if (this.newPassword !== this.repeatNewPassword) {
      this.alert.type = 'danger';
      this.alert.message = 'Your new password does not match the confirm password';
      this.alert.enabled = true;
      return false;
    }
    this.accountService.resetPassword(this.currentPassword, this.newPassword, this.repeatNewPassword).subscribe((response) => {
      if (response.successful) {
        this.alert.type = 'success';
        this.alert.message = response.message;
        this.alert.enabled = true;
        // Show success message
      } else {
        // Show error message
        this.alert.type = 'danger';
        this.alert.message = response.message;
        this.alert.enabled = true;
      }
    });
  }
}
