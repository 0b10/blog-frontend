import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { environment } from '../../environments/environment';
import { PostDetailComponent } from '../ui/post-detail/post-detail.component';
import { PostsComponent } from '../ui/posts/posts.component';
import { LoggerModule } from '../util/logger';
import { IdParamGuard } from './id-param.guard';

const routes: Routes = [
  { path: 'post/:id', component: PostDetailComponent, canActivate: [IdParamGuard] },
  { path: 'home', component: PostsComponent },
  { path: '', redirectTo: 'home', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { enableTracing: !environment.production }), LoggerModule],
  exports: [RouterModule],
})
export class AppRoutingModule {}
