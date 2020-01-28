import { Component } from '@angular/core';
import { INavData } from './ui/nav/navbar/navbar.types';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'blog-frontend';
  navBarItems: INavData[] = [
    {
      text: 'Home',
      uri: 'home',
    },
    {
      text: 'Post One',
      uri: 'post/1',
    },
    {
      text: 'Post Two',
      uri: 'post/2',
    },
  ];
}
