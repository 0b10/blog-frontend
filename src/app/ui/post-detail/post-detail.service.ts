import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { IPost } from '../posts/posts.types';
import { GetPostGqlService } from './graphql/get-post-gql.service';
import { IPostDetailService } from './post-detail.types';

@Injectable({
  providedIn: 'root',
})
export class PostDetailService implements IPostDetailService {
  post: Observable<IPost>;

  constructor(private readonly apolloPost: GetPostGqlService) {}

  observePost(id: IPost['id']): void {
    this.post = this.apolloPost.watch({ id }).valueChanges.pipe(map((result) => result.data.post));
    // this.post = from([
    //   {
    //     id,
    //     // TODO: image alt text
    //     title: `title for post ${id} - ` + faker.lorem.sentence(15),
    //     subtitle: 'subtitle' + faker.lorem.sentence(20),
    //     headerImage: 'https://fakeql.com/placeholder/500/200/e7d621158ec24ef6dsf3sf43459.svg',
    //     tldr: 'tldr' + faker.lorem.sentence(150),
    //     body: 'body' + faker.lorem.sentence(1000),
    //     createdAt: new Date(),
    //     author: {
    //       id: 1,
    //       alias: 'author',
    //     },
    //   },
    // ]);
  }
}
