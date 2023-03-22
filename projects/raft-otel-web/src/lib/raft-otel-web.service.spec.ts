import { TestBed } from '@angular/core/testing';

import { RaftOtelWebService } from './raft-otel-web.service';

describe('RaftOtelWebService', () => {
  let service: RaftOtelWebService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RaftOtelWebService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
