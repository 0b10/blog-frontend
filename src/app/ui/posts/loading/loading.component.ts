import { Component, OnInit } from '@angular/core';
import { PostsService } from '../posts.service';

@Component({
  selector: 'app-loading-posts',
  templateUrl: './loading.component.html',
  styleUrls: ['./loading.component.sass'],
})
export class LoadingPostsComponent implements OnInit {
  public loading = true; // loading should always occur on init
  public loadPecent = 0;

  constructor(private readonly postsService: PostsService) {}

  ngOnInit() {
    // TODO: use a graphql timeout, and use it here
    const intervalId = setInterval(() => {
      this.loadPecent < 100 ? (this.loadPecent += 10) : (this.loadPecent = 0);
    }, 1000);

    this.postsService.posts.subscribe(
      () => {
        this.loading = false;
        clearInterval(intervalId);
      },
      () => {
        this.loading = false;
        clearInterval(intervalId);
      }
    );
  }
}
