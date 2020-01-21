import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PostDetailComponent } from './ui/post-detail/post-detail.component';
import { PostsComponent } from './ui/posts/posts.component';

const routes: Routes = [
  { path: 'post/:id', component: PostDetailComponent },
  { path: '', component: PostsComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
