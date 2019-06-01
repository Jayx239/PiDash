import { Component, OnInit } from '@angular/core';
import {DashboardService} from './dashboard.service';
import {from, Subscription, timer} from 'rxjs';
import {NavigationStart, Router} from '@angular/router';
import {AuthService} from '../common/auth.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',

  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  constructor(private dashboardService: DashboardService, private router: Router, private authService: AuthService) {

    this.pollingInterval = 1000;
    this.cpu = [];
    this.memory = {};
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
  memorySubscription: Subscription;

  ngOnInit() {
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

  listenMemory() {
    this.stopListeningMemory();
    this.memorySubscription = timer(this.pollingInterval, 1000).pipe().subscribe(x => {
      this.dashboardService.getMemory().pipe().subscribe((val) => {
        this.memory = val.memory;
      }, (error) => { }, () => { });
    });
  }

  stopListeningMemory() {
    if (this.memorySubscription != null && !this.memorySubscription.closed) {
      this.memorySubscription.unsubscribe();
    }
  }

  listen() {
    this.listenCpu();
    this.listenMemory();
  }

  stopListening() {
    this.stopListeningCpu();
    this.stopListeningMemory();
  }

}
