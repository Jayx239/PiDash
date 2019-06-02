import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { ConsoleComponent } from './console/console.component';
import { ConsoleInputComponent } from './console/console-input/console-input.component';
import { LogonComponent } from './logon/logon.component';
import { RegisterComponent } from './register/register.component';
import { RegisterService } from './register/register.service';
import { LogonService } from './logon/logon.service';
import { HttpClientModule } from '@angular/common/http';
import {RouterModule} from '@angular/router';
import {FormsModule} from '@angular/forms';
import {DashboardService} from './dashboard/dashboard.service';
import {ServerManagerService} from './server-manager/server-manager.service';
import {InSessionRouteActivatorService} from './common/in-session-route-activator.service';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {AuthService} from './common/auth.service';
import { AlertComponent } from './common/alert/alert.component';



@NgModule({
  declarations: [
    AppComponent,
    ConsoleComponent,
    ConsoleInputComponent,
    LogonComponent,
    RegisterComponent,
    AlertComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    NgbModule,
    RouterModule.forRoot([
      {path: '', component: LogonComponent, pathMatch: 'full'},
      {path: 'logon', component: LogonComponent, pathMatch: 'full'},
      {path: 'register', component: RegisterComponent, pathMatch: 'full'},
      {
        path: 'dash',
        loadChildren: './in-session/in-session.module#InSessionModule',
        canActivate: [InSessionRouteActivatorService]
      },
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
  exports: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
