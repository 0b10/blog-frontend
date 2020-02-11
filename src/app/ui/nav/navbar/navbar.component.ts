import { AfterContentInit, AfterViewInit, Component, Input } from '@angular/core';
import { faBars, IconDefinition } from '@fortawesome/free-solid-svg-icons';
import { ConsoleLoggerService } from '../../../util/logger/console-logger.service';
import { IEvent } from '../../directives/element-width/element-width.types';
import { INavData, INavDataWithId } from './navbar.types';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent implements AfterContentInit, AfterViewInit {
  public activePanelIds: string[] = [];
  public hamburgerMenuIcon: IconDefinition = faBars;
  public vertical: boolean;
  @Input() public navs: INavData[] = []; // this.navs.length on undefined is not good
  private _navsWithId: INavDataWithId[] = [];

  public get navsWithId() {
    if (this._navsWithId.length === 0) {
      // initialise with an id
      this._navsWithId = this.navs.map(({ text, uri }) => {
        const rando = Math.random()
          .toString(36)
          .substring(7);
        return { text, uri, id: `navitem${rando}` };
      });
    }
    return this._navsWithId;
  }

  private _navbarWidth: number;
  private _navitemWidths: Record<string, number> = {};

  private get _summedNavitemWidths(): number {
    return Object.values(this._navitemWidths).reduce((prev, curr) => {
      return prev + curr;
    }, 0);
  }

  constructor(private readonly _logger: ConsoleLoggerService) {}

  public togglePanel(panelId: string) {
    this.isPanelOpen(panelId) ? this.closePanel(panelId) : this.openPanel(panelId);
  }

  public onNavbarResize({ width: navbarWidth }: IEvent) {
    this._navbarWidth = navbarWidth;
    this.toggleDisplayAxis();
  }

  public onNavitemResize({ width: navitemWidth, id }: IEvent) {
    // FIXME: use toggle here too, because nav items might also change in size
    if (typeof id === 'string') {
      this._navitemWidths[id] = navitemWidth;
    }
  }

  public ngAfterContentInit() {
    if (this.navs.length === 0) {
      this._logger.warn('ngAfterContentInit(): navbar items have not been set', 'NavbarComponent');
    }
    this.toggleDisplayAxis(); // this means an appropriate display is used initially
  }

  public ngAfterViewInit() {}

  private openPanel(panelId: string) {
    this.activePanelIds.push(panelId);
  }

  private closePanel(panelId: string) {
    this.activePanelIds = this.activePanelIds.filter((id) => id !== panelId);
  }

  private isPanelOpen(panelId: string) {
    return this.activePanelIds.indexOf(panelId) !== -1;
  }

  private toggleDisplayAxis() {
    // ! cannot be run before ngAfterViewInit - the view must be initialised
    if (this._summedNavitemWidths >= this._navbarWidth) {
      this.vertical = true;
    } else {
      this.vertical = false;
    }
  }
}
