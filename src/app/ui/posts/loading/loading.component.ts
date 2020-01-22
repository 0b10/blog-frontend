import { Component, Input, OnDestroy, OnInit } from '@angular/core';

@Component({
  selector: 'app-loading-posts',
  templateUrl: './loading.component.html',
  styleUrls: ['./loading.component.sass'],
})
export class LoadingPostsComponent implements OnInit, OnDestroy {
  public loadPecent = 0;
  @Input() public status: 'loading' | 'none' | 'error';
  private intervalId: NodeJS.Timer;

  ngOnInit() {
    // TODO: use a graphql timeout, and use it here
    this.intervalId = setInterval(() => {
      this.loadPecent < 100 ? (this.loadPecent += 10) : (this.loadPecent = 0);
    }, 1000);
  }

  ngOnDestroy() {
    clearInterval(this.intervalId);
  }
}
