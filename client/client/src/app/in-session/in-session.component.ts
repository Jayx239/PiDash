import { Component, OnInit } from '@angular/core';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {HeaderBarComponent} from './header-bar/header-bar.component';

@Component({
  selector: 'app-in-session',
  templateUrl: './in-session.component.html',
  styleUrls: ['./in-session.component.css']
})
export class InSessionComponent implements OnInit {

  constructor(private ngbModule: NgbModule) { }

  ngOnInit() {
  }
}
