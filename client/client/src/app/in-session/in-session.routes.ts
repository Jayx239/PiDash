import {DashboardComponent} from '../dashboard/dashboard.component';
import {InSessionComponent} from './in-session.component';
import {AccountComponent} from '../account/account.component';
import {ServerManagerComponent} from '../server-manager/server-manager.component';
import {InSessionRouteActivatorService} from '../common/in-session-route-activator.service';

export const inSessionRoutes = [
    { path: '', component: InSessionComponent, canActivate: [InSessionRouteActivatorService]},
    { path: 'dashboard', component: DashboardComponent, canActivate: [InSessionRouteActivatorService]},
    { path: 'account', component: AccountComponent, canActivate: [InSessionRouteActivatorService]},
    { path: 'servermanager', component: ServerManagerComponent, canActivate: [InSessionRouteActivatorService] },
];
