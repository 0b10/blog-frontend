import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { GetPostApolloService } from './post-detail/graphql/get-post-apollo.service';
import { PostDetailComponent } from './post-detail/post-detail.component';
import { PostDetailService } from './post-detail/post-detail.service';
import { GetPostListApolloService } from './post-list/graphql/get-post-list-apollo.service';
import { PostListComponent } from './post-list/post-list.component';
import { PostSummaryComponent } from './post-summary/post-summary.component';

@NgModule({
  declarations: [PostDetailComponent, PostListComponent, PostSummaryComponent],
  imports: [CommonModule, FontAwesomeModule],
  providers: [PostDetailService, GetPostApolloService, GetPostListApolloService],
  exports: [PostDetailComponent, PostListComponent],
})
export class PostModule {}
