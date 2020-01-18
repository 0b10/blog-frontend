import { Component, OnInit } from '@angular/core';
import { PartialObserver } from 'rxjs';
import { ConsoleLoggerService } from '../../util/logger/console-logger.service';
import { PostsService } from './posts.service';
import { IPost, TOrderBy } from './posts.types';

@Component({
  selector: 'app-posts',
  templateUrl: './posts.component.html',
  styleUrls: ['./posts.component.sass'],
})
export class PostsComponent implements OnInit {
  public posts: IPost[];

  constructor(
    private readonly postsService: PostsService,
    private readonly logger: ConsoleLoggerService
  ) {}

  async ngOnInit() {
    const orderBy: TOrderBy = 'latest';
    const quantity = 10;

    this.logger.debug('ngOnInit(): fetching initial posts', 'PostsComponent', {
      orderBy,
      quantity,
    });

    const postsObserver: PartialObserver<IPost[]> = {
      next: (posts) => {
        this.posts = posts;
        this.logger.debug('ngOnInit(): fetched initial posts', 'PostsComponent', {
          posts: this.posts,
        });
      },
      error: (error) => {
        this.logger.trace(
          'ngOnInit(): unable to fetch posts',
          'PostsComponent',
          {
            orderBy,
            quantity,
          },
          error
        );
      },
    };

    this.postsService.subscribeToPosts('latest', 10, postsObserver);
  }
}
