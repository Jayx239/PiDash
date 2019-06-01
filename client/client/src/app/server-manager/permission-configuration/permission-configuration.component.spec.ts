import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PermissionConfigurationComponent } from './permission-configuration.component';

describe('PermissionConfigurationComponent', () => {
  let component: PermissionConfigurationComponent;
  let fixture: ComponentFixture<PermissionConfigurationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PermissionConfigurationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PermissionConfigurationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
