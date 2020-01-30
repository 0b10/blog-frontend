import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { environment } from '../../../environments/environment';
import { LoggerModule } from '../../util/logger';
import { PostDetailComponent } from '../post/post-detail/post-detail.component';
import { PostListComponent } from '../post/post-list/post-list.component';
import { IdParamGuard } from './id-param.guard';

const routes: Routes = [
  { path: 'post/:id', component: PostDetailComponent, canActivate: [IdParamGuard] },
  { path: 'home', component: PostListComponent },
  { path: '', redirectTo: 'home', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { enableTracing: !environment.production }), LoggerModule],
  exports: [RouterModule],
})
export class AppRoutingModule {}
