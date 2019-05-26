import { Component, OnInit } from '@angular/core';
import {DashboardService} from './dashboard.service';
import {from, Subscription, timer} from 'rxjs';
import {NavigationStart, Router} from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',

  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  constructor(private dashboardService: DashboardService, private router: Router) {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationStart) {
        this.stopListening();
      }
    });
  }

  cpu: any;
  memory: any;
  pollingInterval: number;
  cpuSubscription: Subscription;

  ngOnInit() {
    this.pollingInterval = 1000;
    this.listen();
  }

  listenCpu() {
    this.stopListeningCpu();
    this.cpuSubscription = timer(this.pollingInterval, 1000).pipe().subscribe(x => {
      this.dashboardService.getCpu().pipe().subscribe((val) => {
        this.cpu = val;
      }, (error) => { }, () => { });
    });

  }

  stopListeningCpu() {
    if (this.cpuSubscription != null && !this.cpuSubscription.closed) {
      this.cpuSubscription.unsubscribe();
    }
  }

  listen() {
    this.listenCpu();
  }

  stopListening() {
    this.stopListeningCpu();
  }



}
