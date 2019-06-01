import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LogConfigurationComponent } from './log-configuration.component';

describe('LogConfigurationComponent', () => {
  let component: LogConfigurationComponent;
  let fixture: ComponentFixture<LogConfigurationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LogConfigurationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LogConfigurationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
