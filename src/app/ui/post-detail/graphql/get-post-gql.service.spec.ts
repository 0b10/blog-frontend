import { TestBed } from '@angular/core/testing';

import { GetPostGqlService } from './get-post-gql.service';

describe('GetPostGqlService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: GetPostGqlService = TestBed.get(GetPostGqlService);
    expect(service).toBeTruthy();
  });
});
