import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PartialObserver } from 'rxjs';
import { IPost } from '../posts/posts.types';
import { PostDetailService } from './post-detail.service';

@Component({
  selector: 'app-post-detail',
  templateUrl: './post-detail.component.html',
  styleUrls: ['./post-detail.component.sass'],
})
export class PostDetailComponent implements OnInit {
  post: IPost;
  error = false;
  errorMessage: string;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly postDetailService: PostDetailService
  ) {}

  ngOnInit() {
    const id: number = parseInt(this.route.snapshot.paramMap.get('id'), 10);

    const postObserver: PartialObserver<IPost> = {
      next: (post) => {
        this.error = false;
        this.post = post;
      },
      error: () => {
        this.error = true;
        this.errorMessage = `Unable to fetch post (Post ID: ${id})`;
      },
    };

    this.postDetailService.observePost(id);
    this.postDetailService.post.subscribe(postObserver);
  }
}
