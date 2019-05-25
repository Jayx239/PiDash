import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { ConsoleComponent } from './console/console.component';
import { ConsoleInputComponent } from './console/console-input/console-input.component';
import { LogonComponent } from './logon/logon.component';
import { RegisterComponent } from './register/register.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ServerManagerComponent } from './server-manager/server-manager.component';

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
    BrowserModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
