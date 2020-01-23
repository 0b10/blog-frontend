import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { render } from '@testing-library/angular';
import { from, Subscription } from 'rxjs';
import { fixture } from 'sir-helpalot';
import { ConsoleLoggerService } from '../../../util/logger/console-logger.service';
import { NoopLoggerService } from '../../../util/logger/noop-logger.service';
import { IPost } from '../../posts/posts.types';
import { PostDetailComponent } from '../post-detail.component';
import { PostDetailService } from '../post-detail.service';
import { IPostDetailService } from '../post-detail.types';

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

class FakePostDetailService implements IPostDetailService {
  constructor(public post: IPost = getFakePost(), public error = false, public loading = true) {}

  getPostSub(id: number): Subscription {
    return from([this.post]).subscribe();
  }
}

class FakeActivatedRoute {
  // update me if the component fetches different data from this provider
  snapshot = {
    paramMap: {
      get: () => 1,
    },
  };
}

const renderComponent = () =>
  render(PostDetailComponent, {
    imports: [CommonModule],
    providers: [
      { provide: PostDetailService, useClass: FakePostDetailService },
      { provide: ActivatedRoute, useClass: FakeActivatedRoute },
      { provide: ConsoleLoggerService, useClass: NoopLoggerService },
    ],
  });

describe('PostDetailComponent', () => {
  it('should create', async () => {
    const component = await renderComponent();
    expect(component).toBeTruthy();
  });

  it('should render a title', async () => {
    const { title } = getFakePost();

    const component = await renderComponent();

    expect(component.getAllByRole('heading').map((el) => el.textContent.trim())).toContain(title);
  });

  it('should render a subtitle', async () => {
    const { subtitle } = getFakePost();

    const component = await renderComponent();

    expect(component.getAllByRole('heading').map((el) => el.textContent.trim())).toContain(
      subtitle
    );
  });

  it('should render a tl;dr section', async () => {
    const { tldr } = getFakePost();

    const component = await renderComponent();

    // FIXME: use role
    expect(component.getByTestId('tldr').textContent).toEqual(tldr);
  });

  it('should render a header image', async () => {
    const { headerImage } = getFakePost();

    const component = await renderComponent();
    const elements = component.getAllByRole('img') as HTMLImageElement[];

    expect(elements.map((el) => el.src)).toContain(headerImage);
  });

  it('should render the body', async () => {
    const { body } = getFakePost();

    const component = await renderComponent();

    // FIXME: use role
    expect(component.getByTestId('body').textContent).toContain(body);
  });

  it('should render the author', async () => {
    const { author } = getFakePost();

    const component = await renderComponent();

    // FIXME: use role
    expect(component.getByTestId('meta-data').textContent).toContain(author.alias);
  });

  it('should render the createdAt date', async () => {
    const component = await renderComponent();

    // FIXME: use role
    // received date (from backend) is in ISO format, and is piped into human readable form. Just check that the year is present.
    expect(component.getByTestId('meta-data').textContent).toContain('1970');
  });
});
