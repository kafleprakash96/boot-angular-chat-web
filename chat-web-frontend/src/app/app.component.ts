import { Component,Input } from '@angular/core';
import {Router, RouterModule, RouterOutlet} from '@angular/router';
import {CommonModule} from '@angular/common';
import {LoginComponent} from './components/login/login.component';
import {NgModel} from '@angular/forms';
import {HomeComponent} from './components/home/home.component';
import { HeaderComponent } from './components/header/header.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet,CommonModule,RouterModule,HeaderComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'chat-web-frontend';

  isLoggedIn = false;

  constructor(){}

}
