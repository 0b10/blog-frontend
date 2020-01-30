import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { GetPostApolloService } from './graphql/get-post-apollo.service';
import { PostDetailComponent } from './post-detail.component';

@NgModule({
  imports: [CommonModule],
  declarations: [PostDetailComponent],
  exports: [PostDetailComponent],
  providers: [GetPostApolloService],
})
export class PostDetailModule {}
