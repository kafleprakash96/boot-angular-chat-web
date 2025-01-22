import { Routes } from '@angular/router';
import {LoginComponent} from './components/login/login.component';
import {HomeComponent} from './components/home/home.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { RegisterComponent } from './components/register/register.component';
import { ChatComponent } from './components/chat/chat.component';
import { AuthGuard } from './guards/auth.guard';
import { ProfileComponent } from './components/profile/profile.component';
import { ContactPageComponent } from './components/contact-page/contact-page.component';

export const routes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'dashboard', component: DashboardComponent,canActivate:[AuthGuard]},
  { path: 'register', component: RegisterComponent},
  { path: 'chat/:id', component: ChatComponent },
  { path: 'profile', component: ProfileComponent,canActivate:[AuthGuard] },
  { path: 'profile/:userId', component: ProfileComponent },
  { path: 'contact-us', component: ContactPageComponent},
  { path: '', redirectTo: 'home', pathMatch: 'full' }
];
