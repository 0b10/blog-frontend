import { TestBed } from '@angular/core/testing';
import { ApolloTestingController, ApolloTestingModule } from 'apollo-angular/testing';
import { fixture } from 'sir-helpalot';
import { ConsoleLoggerService } from '../../../util/logger/console-logger.service';
import { NoopLoggerService } from '../../../util/logger/noop-logger.service';
import { GetPostsGqlService } from '../../posts/graphql/get-posts-gql.service';
import { IPost } from '../../posts/posts.types';
import { PostDetailService } from '../post-detail.service';

const getFixtures = () => {
  TestBed.configureTestingModule({
    providers: [GetPostsGqlService, { provide: ConsoleLoggerService, useClass: NoopLoggerService }],
    imports: [ApolloTestingModule],
  });

  const controller: ApolloTestingController = TestBed.get(ApolloTestingController);
  const service: PostDetailService = TestBed.get(PostDetailService);

  return { controller, service };
};

const getFakePost = fixture<IPost>({
  id: 1,
  title: 'fake title 1',
  subtitle: 'fake subtitle 1',
  tldr: 'fake tldr 1',
  headerImage: 'http://localhost/fakeurl',
  body: 'fake body 1',
  author: {
    id: 2,
    alias: 'fake author 2',
  },
  createdAt: new Date(0),
});

describe('PostDetailService', () => {
  it('should initialise', () => {
    const { controller, service } = getFixtures();

    expect(controller).toBeTruthy();
    expect(service).toBeTruthy();

    controller.verify();
  });

  describe('getPostSub', () => {
    it('should should make an api call to getPost', () => {
      const { controller, service } = getFixtures();

      service.getPostSub(1);
      controller.expectOne('getPost');

      controller.verify();
    });

    it('should should call the backend with an id param', () => {
      const { controller, service } = getFixtures();
      const requestedId = 367287;

      service.getPostSub(requestedId);
      const op = controller.expectOne('getPost');

      expect(op.operation.variables.id).toBe(requestedId);
      controller.verify();
    });

    it('should initialise the post property', () => {
      const { controller, service } = getFixtures();
      const id = 1;
      const fakePost = getFakePost({ overrides: { id } });

      expect(service.post).toBeUndefined();

      service.getPostSub(id);
      controller.expectOne('getPost').flush({
        data: {
          post: fakePost,
        },
      });

      setTimeout(() => {
        // FIXME: service.post is not observable, how can this be 'waited' for
        expect(service.post).toEqual(fakePost);
      }, 200);

      controller.verify();
    });

    // TODO: test loading
    // TODO: test error
  });
});
