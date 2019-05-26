import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { ConsoleComponent } from './console/console.component';
import { ConsoleInputComponent } from './console/console-input/console-input.component';
import { LogonComponent } from './logon/logon.component';
import { RegisterComponent } from './register/register.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ServerManagerComponent } from './server-manager/server-manager.component';
import { RegisterService } from './register/register.service';
import { LogonService } from './logon/logon.service';
import { HttpClientModule } from '@angular/common/http';
import {RouterModule} from '@angular/router';
import {FormsModule} from '@angular/forms';
import {DashboardService} from './dashboard/dashboard.service';

@NgModule({
  declarations: [
    AppComponent,
    ConsoleComponent,
    ConsoleInputComponent,
    LogonComponent,
    RegisterComponent,
    DashboardComponent,
    ServerManagerComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    RouterModule.forRoot([
      { path: '', component: LogonComponent, pathMatch: 'full' },
      { path: 'logon', component: LogonComponent, pathMatch: 'full' },
      { path: 'register', component: RegisterComponent, pathMatch: 'full' },
      { path: 'dashboard', component: DashboardComponent, pathMatch: 'full' },
      { path: 'servermanager', component: ServerManagerComponent, pathMatch: 'full' },
    ])
  ],
  providers: [
    LogonService,
    RegisterService,
    DashboardService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
