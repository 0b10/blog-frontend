import { Component, Input, OnInit } from '@angular/core';
import { IAuthor } from '../posts/posts.types';

@Component({
  selector: 'app-post-summary',
  templateUrl: './post-summary.component.html',
  styleUrls: ['./post-summary.component.sass'],
})
export class PostSummaryComponent implements OnInit {
  @Input() public id: number;
  @Input() public title: string;
  @Input() public body: string;
  @Input() public author: IAuthor;
  @Input() public createdAt: Date;
  @Input() public subtitle: string;
  // TODO: header image

  constructor() {}

  ngOnInit() {}
}
