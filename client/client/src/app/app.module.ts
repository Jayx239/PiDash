import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { ConsoleComponent } from './console/console.component';
import { ConsoleInputComponent } from './console/console-input/console-input.component';
import { LogonComponent } from './logon/logon.component';
import { RegisterComponent } from './register/register.component';
import { ServerManagerComponent } from './server-manager/server-manager.component';
import { RegisterService } from './register/register.service';
import { LogonService } from './logon/logon.service';
import { HttpClientModule } from '@angular/common/http';
import {RouterModule} from '@angular/router';
import {FormsModule} from '@angular/forms';
import {DashboardService} from './dashboard/dashboard.service';
import {ServerManagerService} from './server-manager/server-manager.service';
import {InSessionRouteActivatorService} from './common/in-session-route-activator.service';
import { AppListComponent } from './server-manager/app-list/app-list.component';
import { AppDetailsComponent } from './server-manager/app-details/app-details.component';
import { AppConsoleComponent } from './server-manager/app-console/app-console.component';
import { AppConfigurationComponent } from './server-manager/app-configuration/app-configuration.component';
import { PermissionConfigurationComponent } from './server-manager/permission-configuration/permission-configuration.component';
import { LogConfigurationComponent } from './server-manager/log-configuration/log-configuration.component';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {AuthService} from './common/auth.service';


@NgModule({
  declarations: [
    AppComponent,
    ConsoleComponent,
    ConsoleInputComponent,
    LogonComponent,
    RegisterComponent,
    ServerManagerComponent,
    AppListComponent,
    AppDetailsComponent,
    AppConsoleComponent,
    AppConfigurationComponent,
    PermissionConfigurationComponent,
    LogConfigurationComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    NgbModule,
    RouterModule.forRoot([
      { path: '', component: LogonComponent, pathMatch: 'full' },
      { path: 'logon', component: LogonComponent, pathMatch: 'full' },
      { path: 'register', component: RegisterComponent, pathMatch: 'full' },
      { path: 'dash', loadChildren: './in-session/in-session.module#InSessionModule', canActivate: [InSessionRouteActivatorService]},
      { path: 'servermanager', component: ServerManagerComponent, pathMatch: 'full' },
    ])
  ],
  providers: [
    LogonService,
    RegisterService,
    DashboardService,
    ServerManagerService,
    InSessionRouteActivatorService,
    AuthService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
