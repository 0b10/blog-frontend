import {
  AfterContentInit,
  Component,
  ElementRef,
  Input,
  OnDestroy,
  ViewChild,
} from '@angular/core';
import { faBars, IconDefinition } from '@fortawesome/free-solid-svg-icons';
import { fromEvent, Observable, Subscription } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { ConsoleLoggerService } from '../../../util/logger/console-logger.service';
import { INavData } from './navbar.types';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent implements AfterContentInit, AfterContentInit, OnDestroy {
  onResize$: Observable<Event>;
  onResizeSub$: Subscription;
  activePanelIds: string[] = [];
  hamburgerMenuIcon: IconDefinition = faBars;
  vertical: boolean;
  @Input() navs: INavData[] = []; // this.navs.length on undefined is not good
  @ViewChild('primaryNavBar', { static: true }) navBarEl: ElementRef<HTMLElement>;

  // ! this must match the width in the ._item-h navitem css class - change that too if you change this
  // must be a static value, don't derive this from the real value.
  private readonly defaultItemWidth = 170;

  constructor(private readonly logger: ConsoleLoggerService) {}

  togglePanel(panelId: string) {
    this.isPanelOpen(panelId) ? this.closePanel(panelId) : this.openPanel(panelId);
  }

  ngAfterViewInit(): void {
    this.logger.debug(
      'ngAfterViewInit(): registering resize observable for navbar',
      'NavbarComponent'
    );

    this.onResize$ = fromEvent(window, 'resize');
    this.onResizeSub$ = this.onResize$.pipe(debounceTime(100)).subscribe({
      next: () => this.toggleDisplayAxis(),
      error: (error) => {
        this.logger.error(
          'onResize$::error(): there was an error with the window resize observable',
          'NavbarComponent',
          { error, ...this.getLoggedVars() }
        );
      },
    });
  }

  ngAfterContentInit() {
    if (this.navs.length === 0) {
      this.logger.warn('ngAfterContentInit(): navbar items have not been set', 'NavbarComponent');
    }

    this.logger.debug(
      `ngAfterContentInit(): setting initial navbar orientation to ${
        this.vertical ? 'vertical' : 'horizontal'
      }`,
      'NavbarComponent',
      this.getLoggedVars()
    );
    this.toggleDisplayAxis(); // this means an appropriate display is used initially
  }

  ngOnDestroy(): void {
    this.logger.debug(
      'ngOnDestroy(): unsubscribing from resize observable for navbar',
      'NavbarComponent'
    );
    this.onResizeSub$.unsubscribe();
  }

  // >>> PRIVATE >>>
  // ~~~ properties ~~~
  private get summedItemsWidth() {
    return this.defaultItemWidth * this.navs.length;
  }

  private get navBarWidth() {
    return this.navBarEl.nativeElement.offsetWidth;
  }

  // ~~~ panel ~~~
  private openPanel(panelId: string) {
    this.activePanelIds.push(panelId);
    this.logger.debug(`openPanel(): opening #${panelId} panel`, 'NavbarComponent', {
      panelId,
      activePanelIds: this.activePanelIds,
    });
  }

  private closePanel(panelId: string) {
    this.activePanelIds = this.activePanelIds.filter((id) => id !== panelId);
    this.logger.debug(`closePanel(): closing #${panelId} panel`, 'NavbarComponent', {
      panelId,
      activePanelIds: this.activePanelIds,
    });
  }

  private isPanelOpen(panelId: string) {
    return this.activePanelIds.indexOf(panelId) !== -1;
  }

  // ~~~ helpers ~~~
  private getLoggedVars() {
    return {
      navBarWidth: this.navBarWidth,
      summedItemsWidth: this.summedItemsWidth,
      vertical: this.vertical,
    };
  }

  private toggleDisplayAxis() {
    // ! cannot be run before ngAfterViewInit - the view must be initialised

    // the container
    const navBarWidth = this.navBarEl.nativeElement.offsetWidth;

    if (this.summedItemsWidth >= navBarWidth) {
      if (!this.vertical) {
        this.vertical = true;
        this.logger.debug(
          'toggleDisplayAxis(): displaying navbars vertically',
          'NavbarComponent',
          this.getLoggedVars()
        );
      }
    } else {
      if (this.vertical) {
        this.vertical = false;
        this.logger.debug(
          'toggleDisplayAxis(): displaying navbars horizontally',
          'NavbarComponent',
          this.getLoggedVars()
        );
      }
    }
  }
}
