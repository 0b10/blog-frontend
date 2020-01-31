import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { first } from 'rxjs/internal/operators/first';
import { ConsoleLoggerService } from '../../../util/logger/console-logger.service';
import { IPost } from '../post-detail/post-detail.types';
import { GetPostListApolloService } from './graphql/get-post-list-apollo.service';
import { TQueryStatus } from './graphql/graphql.types';
import { IPostListService, TOrderBy, TQuantity } from './post-list.types';

@Injectable({
  providedIn: 'root',
})
export class PostListService implements IPostListService {
  posts$ = new Subject<IPost[]>();
  queryStatus: TQueryStatus;

  constructor(
    private readonly apolloService: GetPostListApolloService,
    private readonly logger: ConsoleLoggerService
  ) {}

  getPostListSubscription(orderBy: TOrderBy = 'latest', quantity: TQuantity = 10) {
    this.queryStatus = 'loading';
    this.logger.debug('getPostListSubscription(): subscribing to post list', 'PostListService');

    return this.apolloService
      .watch({ orderBy, quantity })
      .valueChanges.pipe(first())
      .subscribe({
        next: ({ data, loading }) => {
          if (!loading) {
            this.queryStatus = 'loaded';
            this.posts$.next(data.posts);

            this.logger.debug(
              `getPostListSubscription(): ${data.posts.length} posts fetched`,
              'PostListService',
              {
                posts: data.posts,
                quantity,
                orderBy,
              }
            );
          }
        },
        error: (error) => {
          this.queryStatus = 'error';
          this.logger.error('getPostListSubscription(): unable to fetch posts', 'PostListService', {
            orderBy,
            quantity,
            error,
          });
        },
      });
  }
}
