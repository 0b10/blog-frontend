import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NgbAccordionModule } from '@ng-bootstrap/ng-bootstrap';
import { render, wait } from '@testing-library/angular';
import { fixture } from 'sir-helpalot';
import { ConsoleLoggerService } from '../../../../util/logger/console-logger.service';
import { NoopLoggerService } from '../../../../util/logger/noop-logger.service';
import { NavbarComponent } from '../navbar.component';
import { INavData } from '../navbar.types';
import { NavitemComponent } from '../navitem/navitem.component';

const DEBUG = true; // enable tracing and logging

const getLogger = () => (DEBUG ? ConsoleLoggerService : NoopLoggerService);

const getFakeNavs = fixture<INavData[]>([
  {
    uri: 'fakeuri1',
    text: 'fake item 1',
  },
  {
    uri: 'fakeuri2',
    text: 'fake item 2',
  },
]);

@Component({
  selector: 'fake-routed-1',
  template: '<div data-testid="fake-div-1">fake content 1</div>',
})
class FakeRoutedComponentOne {}

@Component({
  selector: 'fake-routed-2',
  template: '<div data-testid="fake-div-2">fake content 2</div>',
})
class FakeRoutedComponentTwo {}

@Component({
  selector: 'fake-display',
  template: `
    <div data-testid="fake-display">
      <app-navbar [navs]="navBarItems"></app-navbar>
      <router-outlet></router-outlet>
    </div>
  `,
})
class FakeDisplayComponent {
  public navBarItems: INavData[] = getFakeNavs();
}

const getFakeRoutes = fixture<Routes>([
  { path: 'fakeuri1', component: FakeRoutedComponentOne },
  { path: 'fakeuri2', component: FakeRoutedComponentTwo },
]);

const renderComponent = (navs = getFakeNavs()) => {
  return render(FakeDisplayComponent, {
    // render the display component, because it contains the <router-outlet /> (and nav component)
    imports: [
      CommonModule,
      RouterModule.forRoot(getFakeRoutes(), { enableTracing: DEBUG }),
      NgbAccordionModule,
      FontAwesomeModule,
    ],
    declarations: [
      FakeRoutedComponentOne,
      FakeRoutedComponentTwo,
      NavbarComponent,
      NavitemComponent,
    ],
    providers: [{ provide: ConsoleLoggerService, useClass: getLogger() }],
  });
};

// TODO: #e2e, test responsive elements
//  test that:
//    * the hamgburger menu isn't displayed when the navbar is horizontal
//    * the hamburger meny is displayed when the navbar is vertical
//    * navigation items appear when the hamburger menu is clicked
//        - routing has already been tested here
fdescribe('NavbarComponent', () => {
  it('should initialise', async () => {
    const component = await renderComponent();
    expect(component).toBeTruthy();
  });

  it('should display navigation text', async () => {
    const { getByText } = await renderComponent();
    expect(getByText('fake item 1')).toBeTruthy();
    expect(getByText('fake item 2')).toBeTruthy();
  });

  it('should route when clicked', async () => {
    const { click, getByText, queryByText } = await renderComponent();
    // check the content isn't displayed initially - so that when it's found, it's because of routing
    expect(queryByText('fake content 1')).not.toBeTruthy();
    expect(queryByText('fake content 2')).not.toBeTruthy();

    // click item 1
    const item1 = getByText('fake item 1');
    click(item1);
    await wait(() => {
      const content1 = getByText('fake content 1');
      expect(content1).toBeTruthy();
    });

    // click item 2
    const item2 = getByText('fake item 2');
    click(item2);
    await wait(() => {
      const content2 = getByText('fake content 2');
      expect(content2).toBeTruthy();
    });
  });
});
