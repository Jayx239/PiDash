import { TestBed } from '@angular/core/testing';

import { InsessionService } from './insession.service';

describe('InsessionService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: InsessionService = TestBed.get(InsessionService);
    expect(service).toBeTruthy();
  });
});
