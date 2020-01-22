import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { first } from 'rxjs/operators';
import { ConsoleLoggerService } from '../../util/logger/console-logger.service';
import { GetPostsGqlService } from './graphql/get-posts-gql.service';
import { IPost, TOrderBy } from './posts.types';

@Component({
  selector: 'app-posts',
  templateUrl: './posts.component.html',
  styleUrls: ['./posts.component.sass'],
})
export class PostsComponent implements OnInit, OnDestroy {
  public querySubscription$: Subscription;
  public loading = true;
  public posts: IPost[];
  public noPosts = false;
  public error = false;

  constructor(
    private readonly apolloPosts: GetPostsGqlService,
    private readonly logger: ConsoleLoggerService
  ) {}

  async ngOnInit() {
    const orderBy: TOrderBy = 'latest';
    const quantity = 10;

    this.logger.debug('ngOnInit(): subscribing to posts query (fetching posts)', 'PostsComponent', {
      orderBy,
      quantity,
    });

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
            this.logger.debug(`ngOnInit(): ${data.posts.length} posts fetched`, 'PostsComponent', {
              posts: data.posts,
              quantity,
              orderBy,
            });
          }
        },
        error: (error) => {
          this.error = true;
          this.logger.error('ngOnInit(): unable to fetch posts', 'PostsComponent', {
            orderBy,
            quantity,
            error,
          });
        },
      });
  }

  ngOnDestroy(): void {
    this.querySubscription$.unsubscribe();
    this.logger.debug(`ngOnDestroy(): unsubscribed from posts subscription`, 'PostsComponent');
  }
}
