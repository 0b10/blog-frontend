import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { render } from '@testing-library/angular';
import { Subject, Subscription } from 'rxjs';
import { fixture } from 'sir-helpalot/dist/test';
import { ConsoleLoggerService } from '../../../../util/logger/console-logger.service';
import { NoopLoggerService } from '../../../../util/logger/noop-logger.service';
import { IPost } from '../../post-detail/post-detail.types';
import { PostSummaryComponent } from '../../post-summary/post-summary.component';
import { TQueryStatus } from '../graphql/graphql.types';
import { PostListComponent } from '../post-list.component';
import { PostListService } from '../post-list.service';
import { IPostListService, TOrderBy } from '../post-list.types';

const DEBUG = true;

const getLogger = () => (DEBUG ? ConsoleLoggerService : NoopLoggerService);

const getFakePosts = fixture<IPost[]>([
  {
    id: 1,
    title: 'fake title 1',
    subtitle: 'fake subtitle 1',
    tldr: 'fake tldr 1',
    headerImage: 'http://localhost/fakeurl',
    body: 'fake body 1',
    author: {
      id: 1,
      alias: 'fake author 1',
    },
    createdAt: new Date(0),
  },
  {
    id: 2,
    title: 'fake title 2',
    subtitle: 'fake subtitle 2',
    tldr: 'fake tldr 2',
    headerImage: 'http://localhost/fakeurl',
    body: 'fake body 2',
    author: {
      id: 2,
      alias: 'fake author 2',
    },
    createdAt: new Date(0),
  },
  {
    id: 3,
    title: 'fake title 3',
    subtitle: 'fake subtitle 3',
    tldr: 'fake tldr 3',
    headerImage: 'http://localhost/fakeurl',
    body: 'fake body 3',
    author: {
      id: 3,
      alias: 'fake author 3',
    },
    createdAt: new Date(0),
  },
]);

class FakePostListService implements IPostListService {
  posts$: Subject<IPost[]>;
  queryStatus: TQueryStatus;

  constructor() {
    this.posts$ = new Subject();
  }

  getPostListSubscription(orderBy: TOrderBy, quantity: number): Subscription {
    return this.posts$.subscribe(); // keep types happy
  }

  next(posts: IPost[]) {
    this.posts$.next(posts);
  }
}

const renderComponent = (service: FakePostListService = new FakePostListService()) =>
  render(PostListComponent, {
    declarations: [PostSummaryComponent],
    imports: [CommonModule, FontAwesomeModule],
    providers: [
      { provide: PostListService, useFactory: () => service },
      { provide: ConsoleLoggerService, useClass: getLogger() },
    ],
  });

fdescribe('PostListComponent', () => {
  it('should render', async () => {
    const component = await renderComponent();
    expect(component).toBeTruthy();
  });

  it('should display "Loading..." progress bar when the query status is initially "loading"', async () => {
    const expectedMessage = 'Loading...';

    const service = new FakePostListService();
    service.queryStatus = 'loading';
    const component = await renderComponent(service);

    expect(component.getByText(expectedMessage)).toBeTruthy();
  });

  it('should display a "no posts" when status is loaded, but no posts present', async () => {
    const expectedMessage = /No posts to display :\(/;

    const service = new FakePostListService();
    service.queryStatus = 'loaded';
    const component = await renderComponent(service);

    expect(component.getByText(expectedMessage)).toBeTruthy();
  });

  it('should display a "error" when status is initError', async () => {
    const expectedMessage = /There was an error while loading posts/;

    const service = new FakePostListService();
    service.queryStatus = 'error';
    const component = await renderComponent(service);

    expect(component.getByText(expectedMessage)).toBeTruthy();
  });

  it('should display posts when posts are received', async () => {
    const expectedMessage = /fake title/;
    const expectedNumPosts = getFakePosts().length;

    const service = new FakePostListService();
    service.queryStatus = 'loading';
    const component = await renderComponent(service);
    service.queryStatus = 'loaded';
    service.next(getFakePosts());
    component.detectChanges();

    const result = await component.findAllByText(expectedMessage);
    expect(result.length).toBe(expectedNumPosts);
  });
});
