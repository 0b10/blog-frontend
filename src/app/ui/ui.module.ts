import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { PostSummaryComponent } from './post-summary/post-summary.component';
import { GetPostsGqlService } from './posts/graphql/get-posts-gql.service';
import { PostsComponent } from './posts/posts.component';
import { PostsService } from './posts/posts.service';

@NgModule({
  declarations: [PostSummaryComponent, PostsComponent],
  imports: [CommonModule],
  exports: [PostsComponent, PostSummaryComponent],
  providers: [PostsService, GetPostsGqlService],
})
export class UiModule {}
