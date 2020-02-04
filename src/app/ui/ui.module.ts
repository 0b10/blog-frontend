import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ElementWidthDirective } from './directives/element-width.directive';
import { LoadingModule } from './loading/loading.module';
import { PostModule } from './post/post.module';
import { ElementWidthService } from './services/element-width.service';

@NgModule({
  imports: [CommonModule, PostModule],
  exports: [PostModule, LoadingModule],
  declarations: [ElementWidthDirective, ElementWidthService],
})
export class UiModule {}
