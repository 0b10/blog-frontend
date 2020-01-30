import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { NgbProgressbarModule } from '@ng-bootstrap/ng-bootstrap';
import { ProgressBarComponent } from './progress-bar/progress-bar.component';

@NgModule({
  declarations: [ProgressBarComponent],
  imports: [CommonModule, NgbProgressbarModule],
  exports: [ProgressBarComponent],
})
export class LoadingModule {}
