import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { ConsoleLoggerService } from '../../../util/logger/console-logger.service';
import { IPost } from '../post-detail/post-detail.types';
import { PostListService } from './post-list.service';
import { TOrderBy, TPostListStatus, TQuantity } from './post-list.types';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.scss'],
})
export class PostListComponent implements OnInit, OnDestroy {
  private _querySub$: Subscription;
  private _queryStatusSub$: Subscription;
  private _initialising = true; // true when posts is being initialised/reinitialised.
  public posts: IPost[] = [];

  constructor(
    private readonly postListService: PostListService,
    private readonly logger: ConsoleLoggerService
  ) {}

  async ngOnInit() {
    const orderBy: TOrderBy = 'latest';
    const quantity: TQuantity = 10;

    this.logger.debug(
      'ngOnInit(): subscribing to posts query (fetching posts)',
      'PostListComponent',
      {
        orderBy,
        quantity,
      }
    );

    this._querySub$ = this.postListService.getPostListSubscription(orderBy, quantity);

    this._queryStatusSub$ = this.postListService.posts$.subscribe({
      next: (posts) => {
        this.posts = posts;
        this._loaded(); // must do this - status will return 'initialising' otherwise
        this.logger.debug(
          'posts$::next(): posts received, setting _initialising to false',
          'PostListComponent',
          { initialising: this._initialising, posts: this.posts }
        );
      },
    });
  }

  /**
   * @returns
   * initialising: if the current list of posts hasn't been initialised, or is being reinitialised.
   *
   * loading: if the component has already initialised, but has no posts - useful in cases where
   *  there was an issue initially loading posts, but the component is initialised, and you need to
   *  load initial posts.
   *
   * loadingMore: if posts have already been loaded, but more are being loaded - useful for pagination.
   *
   * noPosts: if the query returned zero posts. Almost never useful.
   *
   * loaded: when the query has finished, and there are posts to view.
   *
   * error: when there was an issue retrieving initial posts.
   *
   * loadingMoreError: when there was an issue retrieving posts, but there are already some posts
   *  retrieved - useful in cases where you wish to keep the current posts visible, but also be
   *  notified that there's an error for the last retrieval.
   */
  public get status(): TPostListStatus {
    this.logger.debug(
      `status: the backend status is: ${this.postListService.queryStatus}`,
      'PostListComponent'
    );
    let status: TPostListStatus;
    switch (this.postListService.queryStatus) {
      case 'loading':
        status = this._initialising ? 'init' : this.hasPosts ? 'loadingMore' : 'loading';
        break;
      case 'loaded':
        status = this.noPosts ? 'noPosts' : 'loaded';
        break;
      case 'error':
        status = this.noPosts ? 'initError' : 'loadingMoreError';
        break;
      default:
        this.logger.error(
          `status: unknown status: ${this.postListService.queryStatus}`,
          'PostListComponent'
        );
    }
    this.logger.debug(`status: the component status is ${status!}`, 'PostListComponent');
    return status!;
  }

  private _loaded() {
    if (this._initialising) {
      this._initialising = false;
    }
  }

  private get noPosts() {
    return this.posts.length === 0;
  }

  private get hasPosts() {
    return this.posts.length > 0;
  }

  ngOnDestroy(): void {
    this._querySub$.unsubscribe();
    this._queryStatusSub$.unsubscribe();
    this.logger.debug(
      `ngOnDestroy(): unsubscribed from _querySub$ and _queryStatusSub$`,
      'PostListComponent'
    );
  }
}
