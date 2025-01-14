import {Component, CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import {Router} from '@angular/router';
import {MatToolbar, MatToolbarRow} from '@angular/material/toolbar';
import {MatIcon} from '@angular/material/icon';
import {MatCard, MatCardActions, MatCardContent, MatCardHeader, MatCardTitle} from '@angular/material/card';
import {MatGridList, MatGridTile} from '@angular/material/grid-list';
import {MatButton} from '@angular/material/button';

;

@Component({
  selector: 'app-home',
  imports: [MatToolbar,
    MatToolbarRow,
    MatIcon,
    MatCard,
    MatCardHeader,
    MatCardTitle,
    MatCardContent,
    MatCardActions,
    MatGridList,
    MatGridTile,
    MatCard,
    MatCardHeader,
    MatIcon,
  MatButton],
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
