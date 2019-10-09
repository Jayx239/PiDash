import {Component, Input, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {AuthService} from "../../common/auth.service";

@Component({
  selector: 'app-header-bar',
  templateUrl: './header-bar.component.html',
  styleUrls: ['./header-bar.component.css']
})
export class HeaderBarComponent implements OnInit {

  @Input() activeIndex: number;
  constructor(private router: Router, private authService: AuthService) { }

  ngOnInit() {
  }

  logout() {
    this.authService.logout().subscribe((response: any) => {
      if (response.successful) {
        this.router.navigate(['/logon']);
      }
    },
      () => {},
      () => {});

  }
}
