import { Injectable } from '@angular/core';
import { Subscription } from 'rxjs';
import { first } from 'rxjs/operators';
import { ConsoleLoggerService } from '../../../util/logger/console-logger.service';
import { GetPostApolloService } from './graphql/get-post-apollo.service';
import { IPost, IPostDetailService } from './post-detail.types';

@Injectable({
  providedIn: 'root',
})
export class PostDetailService implements IPostDetailService {
  post: IPost;
  error = false;
  loading = true;

  constructor(
    private readonly logger: ConsoleLoggerService,
    private readonly apolloPost: GetPostApolloService
  ) {}

  getPostSub(id: IPost['id']): Subscription {
    this.logger.debug('getPostSub(): subscribing to and running post query', 'PostDetailService', {
      id,
    });

    return this.apolloPost
      .watch({ id })
      .valueChanges.pipe(first())
      .subscribe({
        next: ({ data, loading }) => {
          this.error = false;
          this.loading = loading;
          this.post = data.post;

          if (!loading) {
            this.logger.debug(`getPostSub(): post for id:${id} fetched`, 'PostDetailService', {
              id,
              post: data.post,
            });
          }
        },
        error: (error) => {
          this.error = true;
          this.logger.error('getPostSub(): unable to fetch posts', 'PostDetailService', {
            id,
            error,
          });
        },
      });
  }
}
