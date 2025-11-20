import { TestBed } from '@angular/core/testing';
import { ResolveFn } from '@angular/router';

import { branchResolver } from './branch.resolver';

describe('branchResolver', () => {
  const executeResolver: ResolveFn<boolean> = (...resolverParameters) => 
      TestBed.runInInjectionContext(() => branchResolver(...resolverParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeResolver).toBeTruthy();
  });
});
