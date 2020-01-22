import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { first, map } from 'rxjs/operators';
import { IPost } from '../posts/posts.types';
import { GetPostGqlService } from './graphql/get-post-gql.service';

@Component({
  selector: 'app-post-detail',
  templateUrl: './post-detail.component.html',
  styleUrls: ['./post-detail.component.sass'],
})
export class PostDetailComponent implements OnInit {
  post$: Observable<IPost>;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly apolloPost: GetPostGqlService
  ) {}

  ngOnInit() {
    const id: number = parseInt(this.route.snapshot.paramMap.get('id'), 10);
    this.post$ = this.apolloPost.watch({ id }).valueChanges.pipe(
      first(),
      map((result) => result.data.post)
    );
  }
}
