import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InSessionComponent } from './in-session.component';

describe('InSessionComponent', () => {
  let component: InSessionComponent;
  let fixture: ComponentFixture<InSessionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InSessionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InSessionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
