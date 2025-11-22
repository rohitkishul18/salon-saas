import { TestBed } from '@angular/core/testing';

import { CustomerAuthService } from './customer-auth.service.service';

describe('CustomerAuthServiceService', () => {
  let service: CustomerAuthService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CustomerAuthService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
