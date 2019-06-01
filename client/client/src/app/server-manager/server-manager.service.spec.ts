import { TestBed } from '@angular/core/testing';

import { ServerManagerService } from './server-manager.service';

describe('ServerManagerService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ServerManagerService = TestBed.get(ServerManagerService);
    expect(service).toBeTruthy();
  });
});
