import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NgbAccordionModule } from '@ng-bootstrap/ng-bootstrap';
import { NavbarComponent } from './navbar.component';
import { NavitemComponent } from './navitem/navitem.component';

@NgModule({
  declarations: [NavbarComponent, NavitemComponent],
  imports: [CommonModule, RouterModule, NgbAccordionModule, FontAwesomeModule],
  exports: [NavbarComponent],
})
export class NavbarModule {}
