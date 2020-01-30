import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { first } from 'rxjs/operators';
import { ConsoleLoggerService } from '../../../util/logger/console-logger.service';
import { IPost } from '../post-detail/post-detail.types';
import { GetPostListApolloService } from './graphql/get-post-list-apollo.service';
import { TOrderBy } from './post-list.types';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.scss'],
})
export class PostListComponent implements OnInit, OnDestroy {
  public querySubscription$: Subscription;
  public loading = true;
  public posts: IPost[];
  public noPosts = false;
  public error = false;

  constructor(
    private readonly apolloPosts: GetPostListApolloService,
    private readonly logger: ConsoleLoggerService
  ) {}

  async ngOnInit() {
    const orderBy: TOrderBy = 'latest';
    const quantity = 10;

    this.logger.debug(
      'ngOnInit(): subscribing to posts query (fetching posts)',
      'PostListComponent',
      {
        orderBy,
        quantity,
      }
    );

    this.querySubscription$ = this.apolloPosts
      .watch({ orderBy, quantity })
      .valueChanges.pipe(first())
      .subscribe({
        next: ({ data, loading }) => {
          this.error = false;
          this.loading = loading;
          this.posts = data.posts;
          this.noPosts = loading ? false : data.posts.length === 0;

          if (!loading) {
            this.logger.debug(
              `ngOnInit(): ${data.posts.length} posts fetched`,
              'PostListComponent',
              {
                posts: data.posts,
                quantity,
                orderBy,
              }
            );
          }
        },
        error: (error) => {
          this.error = true;
          this.logger.error('ngOnInit(): unable to fetch posts', 'PostListComponent', {
            orderBy,
            quantity,
            error,
          });
        },
      });
  }

  ngOnDestroy(): void {
    this.querySubscription$.unsubscribe();
    this.logger.debug(`ngOnDestroy(): unsubscribed from posts subscription`, 'PostListComponent');
  }
}
