import { Component, OnInit } from '@angular/core';
import {AuthService, User} from '../common/auth.service';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.css']
})
export class AccountComponent implements OnInit {

  activePanel: number;
  user: User;

  constructor(private authService: AuthService) {
    this.activePanel = 0;
  }

  ngOnInit() {
    this.authService.getUser().subscribe((user) => {
      this.user = user;
    }, (error) =>{}, () => {});
  }

}
