import {DashboardComponent} from '../dashboard/dashboard.component';
import {InSessionComponent} from './in-session.component';

export const inSessionRoutes = [
    { path: '', component: InSessionComponent },
    { path: 'dashboard', component: DashboardComponent }
];
