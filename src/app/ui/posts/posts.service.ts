import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { GetPostsGqlService } from './graphql/get-posts-gql.service';
import { IPost, IPostsAdapter, TOrderBy, TQuantity } from './posts.types';

@Injectable({
  providedIn: 'root',
})
export class PostsService implements IPostsAdapter {
  public posts: Observable<IPost[]>;

  constructor(private readonly apolloPosts: GetPostsGqlService) {}

  observePosts(orderBy: TOrderBy = 'latest', quantity: TQuantity = 10) {
    this.posts = this.apolloPosts
      .watch({ orderBy, quantity })
      .valueChanges.pipe(map((result) => result.data.posts));
  }
}
