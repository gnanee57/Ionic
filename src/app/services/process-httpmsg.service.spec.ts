import { TestBed } from '@angular/core/testing';

import { ProcessHTTPmsgService } from './process-httpmsg.service';

describe('ProcessHttpmsgService', () => {
  let service: ProcessHTTPmsgService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProcessHTTPmsgService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
