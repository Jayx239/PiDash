import {Component, Input, OnInit} from '@angular/core';
import {AppPermission, AppUser} from '../../common/pi-dash-app';
import {ServerManagerService} from '../server-manager.service';

@Component({
  selector: 'app-permission-configuration',
  templateUrl: './permission-configuration.component.html',
  styleUrls: ['./permission-configuration.component.css']
})
export class PermissionConfigurationComponent implements OnInit {
  @Input() activeAppPermissions: AppPermission[];
  @Input() appId: number;
  constructor(private serverManagerService: ServerManagerService) { }

  ngOnInit() {
  }
  resetPermissionUserId(appPermission: AppPermission) {
    appPermission.appUser.userId = -1;
  }
  deleteActiveAppPermission(permissionIndex: number) {

    this.serverManagerService.deleteAppPermissionByPermissionId
    (this.activeAppPermissions[permissionIndex].permissionId, this.activeAppPermissions[permissionIndex].appId).subscribe(() => {
      this.activeAppPermissions.splice(permissionIndex, 1);
    });
  }
  addActiveAppPermission() {
    if (!this.activeAppPermissions) {
      this.activeAppPermissions = [];
    }
    this.activeAppPermissions.push(new AppPermission(-1, this.appId, new AppUser('', -1), -1, false, false, false));
  }


}
