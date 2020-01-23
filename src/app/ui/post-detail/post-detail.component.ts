import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { ConsoleLoggerService } from '../../util/logger/console-logger.service';
import { PostDetailService } from './post-detail.service';

@Component({
  selector: 'app-post-detail',
  templateUrl: './post-detail.component.html',
  styleUrls: ['./post-detail.component.sass'],
})
export class PostDetailComponent implements OnInit, OnDestroy {
  private postSub: Subscription;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly logger: ConsoleLoggerService,
    public readonly service: PostDetailService
  ) {}

  ngOnInit() {
    const id: number = parseInt(this.route.snapshot.paramMap.get('id'), 10);
    this.postSub = this.service.getPostSub(id);
  }

  ngOnDestroy(): void {
    this.postSub.unsubscribe();
    this.logger.debug(`ngOnDestroy(): unsubscribed from post subscription`, 'PostDetailComponent');
  }
}
