import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import faker from 'faker';
import { IPost } from '../posts/posts.types';

@Component({
  selector: 'app-post-detail',
  templateUrl: './post-detail.component.html',
  styleUrls: ['./post-detail.component.sass'],
})
export class PostDetailComponent implements OnInit {
  post: IPost;

  constructor(private readonly route: ActivatedRoute) {}

  ngOnInit() {
    const id: number = parseInt(this.route.snapshot.paramMap.get('id'), 10);
    this.post = {
      id,
      // TODO: image alt text
      title: `title for post ${id} - ` + faker.lorem.sentence(15),
      subtitle: 'subtitle' + faker.lorem.sentence(20),
      headerImage: 'https://fakeql.com/placeholder/500/200/e7d621158ec24ef6dsf3sf43459.svg',
      tldr: 'tldr' + faker.lorem.sentence(150),
      body: 'body' + faker.lorem.sentence(1000),
      createdAt: new Date(),
      author: {
        id: 1,
        alias: 'author',
      },
    };
  }
}
