import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { LoadingModule } from './loading/loading.module';
import { PostModule } from './post/post.module';

@NgModule({
  imports: [CommonModule, PostModule],
  exports: [PostModule, LoadingModule],
})
export class UiModule {}
