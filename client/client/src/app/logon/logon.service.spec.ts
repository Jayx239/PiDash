import { TestBed } from '@angular/core/testing';

import { LogonService } from './logon.service';

describe('LogonService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: LogonService = TestBed.get(LogonService);
    expect(service).toBeTruthy();
  });
});
