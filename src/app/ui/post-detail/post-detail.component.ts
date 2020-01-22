import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { first } from 'rxjs/operators';
import { ConsoleLoggerService } from '../../util/logger/console-logger.service';
import { IPost } from '../posts/posts.types';
import { GetPostGqlService } from './graphql/get-post-gql.service';

@Component({
  selector: 'app-post-detail',
  templateUrl: './post-detail.component.html',
  styleUrls: ['./post-detail.component.sass'],
})
export class PostDetailComponent implements OnInit, OnDestroy {
  post: IPost;
  error = false;
  loading = true;
  postSubscription: Subscription;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly logger: ConsoleLoggerService,
    private readonly apolloPost: GetPostGqlService
  ) {}

  ngOnInit() {
    const id: number = parseInt(this.route.snapshot.paramMap.get('id'), 10);

    this.logger.debug(
      'ngOnInit(): subscribing to post query (fetching post)',
      'PostDetailComponent',
      { id, route: this.route }
    );

    this.postSubscription = this.apolloPost
      .watch({ id })
      .valueChanges.pipe(first())
      .subscribe({
        next: ({ data, loading }) => {
          this.error = false;
          this.loading = loading;
          this.post = data.post;

          if (!loading) {
            this.logger.debug(`ngOnInit(): post for id:${id} fetched`, 'PostsComponent', {
              id,
              post: data.post,
              route: this.route,
            });
          }
        },
        error: (error) => {
          this.error = true;
          this.logger.error('ngOnInit(): unable to fetch posts', 'PostDetailComponent', {
            id,
            error,
            route: this.route,
          });
        },
      });
  }

  ngOnDestroy(): void {
    this.postSubscription.unsubscribe();
    this.logger.debug(`ngOnDestroy(): unsubscribed from post subscription`, 'PostDetailComponent');
  }
}
