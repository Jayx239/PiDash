import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  firstName: string;
  middleName: string;
  lastName: string;
  birthDay: number;
  birthMonth: number;
  birthYear: number;
  userName: string;
  password: string;

  constructor() { }

  ngOnInit() {
  }

  register() {

  }

}
