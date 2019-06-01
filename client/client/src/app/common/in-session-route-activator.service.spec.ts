import { TestBed } from '@angular/core/testing';

import { InSessionRouteActivatorService } from './in-session-route-activator.service';

describe('InSessionRouteActivatorService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: InSessionRouteActivatorService = TestBed.get(InSessionRouteActivatorService);
    expect(service).toBeTruthy();
  });
});
