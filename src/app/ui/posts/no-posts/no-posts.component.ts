import { Component, OnInit } from '@angular/core';
import { PostsService } from '../posts.service';

@Component({
  selector: 'app-no-posts',
  templateUrl: './no-posts.component.html',
  styleUrls: ['./no-posts.component.sass'],
})
export class NoPostsComponent implements OnInit {
  public loading = true; // loading should always occur on init

  constructor(private readonly postsService: PostsService) {}

  ngOnInit() {
    this.postsService.posts.subscribe(
      () => (this.loading = true),
      () => (this.loading = false) // is not loading if error
    );
  }
}
