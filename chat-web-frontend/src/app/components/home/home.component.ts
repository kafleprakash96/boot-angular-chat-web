import {Component, CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import {Router} from '@angular/router';
import {MatToolbar, MatToolbarRow} from '@angular/material/toolbar';
import {MatIcon} from '@angular/material/icon';
import {MatCard, MatCardActions, MatCardContent, MatCardHeader, MatCardTitle} from '@angular/material/card';
import {MatGridList, MatGridTile} from '@angular/material/grid-list';
import {MatButton} from '@angular/material/button';
import { HeaderComponent } from '../header/header.component';
import { AboutPageComponent } from '../about-page/about-page.component';

;

@Component({
  selector: 'app-home',
  imports: [MatToolbar,
    MatIcon,
    MatCard,
    MatGridList,
    MatGridTile,
    MatCard,
    MatIcon,
  MatButton,HeaderComponent,AboutPageComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent {

  constructor(private router:Router) {
  }

  navigate(path: string): void {
    this.router.navigate([path]);
  }

}
