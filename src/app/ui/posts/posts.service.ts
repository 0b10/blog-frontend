import { Injectable } from '@angular/core';
import { PartialObserver } from 'rxjs';
import { map } from 'rxjs/operators';
import { GetPostsGqlService } from './graphql/get-posts-gql.service';
import { IPost, IPostsAdapter, TOrderBy, TQuantity } from './posts.types';

@Injectable({
  providedIn: 'root',
})
export class PostsService implements IPostsAdapter {
  constructor(private readonly apolloPosts: GetPostsGqlService) {}

  subscribeToPosts(
    orderBy: TOrderBy = 'latest',
    quantity: TQuantity = 10,
    observer: PartialObserver<IPost[]>
  ) {
    this.apolloPosts
      .watch({ orderBy, quantity })
      .valueChanges.pipe(map((result) => result.data.posts))
      .subscribe(observer);
  }
}
