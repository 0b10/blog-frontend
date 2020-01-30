import { TestBed } from '@angular/core/testing';
import { GetPostApolloService } from './get-post-apollo.service';

describe('GetPostGqlService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: GetPostApolloService = TestBed.get(GetPostApolloService);
    expect(service).toBeTruthy();
  });
});
