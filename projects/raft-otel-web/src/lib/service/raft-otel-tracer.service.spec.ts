/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { RaftOtelTracerService } from '../service/raft-otel-tracer.service';

describe('Service: RaftOtelTracer', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [RaftOtelTracerService],
    });
  });

  it('should ...', inject(
    [RaftOtelTracerService],
    (service: RaftOtelTracerService) => {
      expect(service).toBeTruthy();
    }
  ));
});
