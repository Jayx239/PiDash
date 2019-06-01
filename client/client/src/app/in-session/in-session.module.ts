import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {InSessionComponent} from './in-session.component';
import {inSessionRoutes} from './in-session.routes';
import {Router, RouterModule} from '@angular/router';
import {DashboardService} from '../dashboard/dashboard.service';
import {DashboardComponent} from '../dashboard/dashboard.component';
import {AuthService} from '../common/auth.service';
import {LogonService} from '../logon/logon.service';
import {RegisterService} from '../register/register.service';
import {ServerManagerService} from '../server-manager/server-manager.service';
import {InSessionRouteActivatorService} from '../common/in-session-route-activator.service';
import {AppComponent} from '../app.component';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';

@NgModule({
  declarations: [
    InSessionComponent,
    DashboardComponent
  ],
  imports: [
    CommonModule,
    NgbModule,
    RouterModule.forChild(inSessionRoutes)
  ],
  providers: [
    LogonService,
    RegisterService,
    DashboardService,
    ServerManagerService,
    InSessionRouteActivatorService,
    AuthService
  ],
  bootstrap: [InSessionComponent]
})
export class InSessionModule { }
