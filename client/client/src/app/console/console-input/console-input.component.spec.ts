import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsoleInputComponent } from './console-input.component';

describe('ConsoleInputComponent', () => {
  let component: ConsoleInputComponent;
  let fixture: ComponentFixture<ConsoleInputComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConsoleInputComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConsoleInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
