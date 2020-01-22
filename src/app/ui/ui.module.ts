import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { NgbProgressbarModule } from '@ng-bootstrap/ng-bootstrap';
import { GetPostGqlService } from './post-detail/graphql/get-post-gql.service';
import { PostDetailComponent } from './post-detail/post-detail.component';
import { PostSummaryComponent } from './post-summary/post-summary.component';
import { GetPostsGqlService } from './posts/graphql/get-posts-gql.service';
import { LoadingPostsComponent } from './posts/loading/loading.component';
import { PostsComponent } from './posts/posts.component';

@NgModule({
  declarations: [PostSummaryComponent, PostsComponent, LoadingPostsComponent, PostDetailComponent],
  imports: [CommonModule, NgbProgressbarModule],
  exports: [PostsComponent, PostSummaryComponent, PostDetailComponent],
  providers: [GetPostsGqlService, GetPostGqlService],
})
export class UiModule {}
