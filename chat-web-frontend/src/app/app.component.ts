import { Component } from '@angular/core';
import {Router, RouterModule, RouterOutlet} from '@angular/router';
import {CommonModule} from '@angular/common';
import {LoginComponent} from './components/login/login.component';
import {NgModel} from '@angular/forms';
import {HomeComponent} from './components/home/home.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet,CommonModule,LoginComponent,RouterModule,HomeComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'chat-web-frontend';

  constructor( private router: Router
  ) {}


}
