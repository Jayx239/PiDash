import { Component, OnInit } from '@angular/core';
import {RegisterService} from './register.service';
import { NgForm } from '@angular/forms';
import {Alert, IAlert} from '../common/alert/alert.component';
import {Router} from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  model: Registration;
  alert: IAlert;

  constructor(private registerService: RegisterService, private router: Router) {
    this.model = new Registration();
    this.alert = new Alert(false, '', 'danger');
  }

  ngOnInit() {
  }

  register(form: NgForm) {
    this.touchAllControls(form);
    if (this.model.password !== this.model.passwordConfirmation) {
      /*this.alert.message = 'Passwords do not match';
      this.alert.type = 'danger';
      this.alert.enabled = true;
      this.alert.setCloseIn(3000);*/
      return;
    }

    if (form.valid) {
      this.registerService.register(this.model.firstName, this.model.middleName,
        this.model.lastName, this.model.birthDay, this.model.birthMonth, this.model.birthYear,
        this.model.userName, this.model.password).subscribe((result) => {
        if (result && result.successful) {
          this.alert.message = 'Registration successful';
          this.alert.type = 'success';
          this.alert.enabled = true;
          this.alert.setCloseIn(3000);
          new Promise(resolve => setTimeout(resolve, 1500)).then(() => {
            this.router.navigate(['logon']);
          });
        } else {
          this.alert.message = 'Error registering user';
          this.alert.type = 'danger';
          this.alert.enabled = true;
          this.alert.setCloseIn(3000);
        }
      });
    }
  }

  touchAllControls(formGroup: NgForm) {
    (Object as any).values(formGroup.controls).forEach(control => {
      control.markAsTouched();
      control.markAsDirty();
      if (control.controls) {
        control.markFormGroupTouched(control);
      }
    });
  }

}

export class Registration {
  firstName: string;
  middleName: string;
  lastName: string;
  birthDay: number;
  birthMonth: number;
  birthYear: number;
  userName: string;
  password: string;
  passwordConfirmation: string;
}
