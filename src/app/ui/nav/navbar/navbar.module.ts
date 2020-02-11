import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NgbAccordionModule } from '@ng-bootstrap/ng-bootstrap';
import { ElementWidthModule } from '../../directives/element-width/element-width.module';
import { NavbarComponent } from './navbar.component';
import { NavitemComponent } from './navitem/navitem.component';

@NgModule({
  declarations: [NavbarComponent, NavitemComponent],
  imports: [CommonModule, RouterModule, NgbAccordionModule, FontAwesomeModule, ElementWidthModule],
  exports: [NavbarComponent],
})
export class NavbarModule {}
