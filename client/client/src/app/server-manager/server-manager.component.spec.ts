import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ServerManagerComponent } from './server-manager.component';

describe('ServerManagerComponent', () => {
  let component: ServerManagerComponent;
  let fixture: ComponentFixture<ServerManagerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ServerManagerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ServerManagerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
