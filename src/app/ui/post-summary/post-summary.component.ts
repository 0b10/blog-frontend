import { Component, Input, OnInit } from '@angular/core';
import { IPost } from '../posts/posts.types';

@Component({
  selector: 'app-post-summary',
  templateUrl: './post-summary.component.html',
  styleUrls: ['./post-summary.component.scss'],
})
export class PostSummaryComponent implements OnInit {
  @Input() public post: IPost;

  constructor() {}

  ngOnInit() {}
}
