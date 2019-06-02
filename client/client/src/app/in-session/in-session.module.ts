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
import { HeaderBarComponent } from './header-bar/header-bar.component';
import {AccountComponent} from '../account/account.component';
import {ServerManagerComponent} from '../server-manager/server-manager.component';
import {AppListComponent} from '../server-manager/app-list/app-list.component';
import {AppDetailsComponent} from '../server-manager/app-details/app-details.component';
import {AppConsoleComponent} from '../server-manager/app-console/app-console.component';
import {AppConfigurationComponent} from '../server-manager/app-configuration/app-configuration.component';
import {PermissionConfigurationComponent} from '../server-manager/permission-configuration/permission-configuration.component';
import {LogConfigurationComponent} from '../server-manager/log-configuration/log-configuration.component';
import { ResetPasswordComponent } from '../account/reset-password/reset-password.component';
@NgModule({
  declarations: [
    InSessionComponent,
    DashboardComponent,
    HeaderBarComponent,
    AccountComponent,
    ServerManagerComponent,
    ServerManagerComponent,
    AppListComponent,
    AppDetailsComponent,
    AppConsoleComponent,
    AppConfigurationComponent,
    PermissionConfigurationComponent,
    LogConfigurationComponent,
    ResetPasswordComponent
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
