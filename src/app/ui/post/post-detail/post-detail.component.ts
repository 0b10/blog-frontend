import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { ConsoleLoggerService } from '../../../util/logger/console-logger.service';
import { PostDetailService } from './post-detail.service';

@Component({
  selector: 'app-post-detail',
  templateUrl: './post-detail.component.html',
  styleUrls: ['./post-detail.component.scss'],
})
export class PostDetailComponent implements OnInit, OnDestroy {
  private postSub: Subscription;

  constructor(
    private readonly activatedRoute: ActivatedRoute,
    private readonly logger: ConsoleLoggerService,
    public readonly service: PostDetailService
  ) {}

  private isIntString(param: unknown): param is string {
    return typeof param === 'string' && !!param.match(/^[0-9]+$/);
  }

  ngOnInit() {
    // FIXME: get returns id or null, set 404 page when it is implemented
    const id: number = parseInt(this.activatedRoute.snapshot.paramMap.get('id')!, 10);
    this.postSub = this.service.getPostSub(id);

    // handle route changes (params === scoped params Observable)
    this.activatedRoute.params.subscribe({
      next: ({ id }) => {
        this.postSub.unsubscribe();

        // is int
        if (this.isIntString(id)) {
          // id could easily be a String(float), or NaN
          this.postSub = this.service.getPostSub(parseInt(id));
        } else {
          this.logger.warn('ngOnInit(): an incorrect id type was given', 'PostDetailComponent');
          // TODO: some 404 stuff
        }
      },
      error: (error) => {
        this.logger.error(
          'ngOnInit(): there was a problem when changing the active route',
          'PostDetailComponent',
          { error, activatedRoute: this.activatedRoute }
        );
      },
    });
  }

  ngOnDestroy(): void {
    this.postSub.unsubscribe();
    this.logger.debug(`ngOnDestroy(): unsubscribed from post subscription`, 'PostDetailComponent');
  }
}
