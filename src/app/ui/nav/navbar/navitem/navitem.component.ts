import { Component, Input } from '@angular/core';
import { INavData } from '../navbar.types';

@Component({
  selector: 'app-navitem',
  templateUrl: './navitem.component.html',
  styleUrls: ['./navitem.component.scss'],
})
export class NavitemComponent {
  @Input() uri: INavData['uri'];
  @Input() text: INavData['text'];
  @Input() vertical: boolean;
}
