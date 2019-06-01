import {DashboardComponent} from '../dashboard/dashboard.component';
import {InSessionComponent} from './in-session.component';
import {AccountComponent} from '../account/account.component';
import {ServerManagerComponent} from '../server-manager/server-manager.component';

export const inSessionRoutes = [
    { path: '', component: InSessionComponent },
    { path: 'dashboard', component: DashboardComponent },
    { path: 'account', component: AccountComponent},
    { path: 'servermanager', component: ServerManagerComponent },
];
