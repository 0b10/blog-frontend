import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { GetPostGqlService } from './graphql/get-post-gql.service';
import { PostDetailComponent } from './post-detail.component';

@NgModule({
  imports: [CommonModule],
  declarations: [PostDetailComponent],
  exports: [PostDetailComponent],
  providers: [GetPostGqlService],
})
export class PostDetailModule {}
