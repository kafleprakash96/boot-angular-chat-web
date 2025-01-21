import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { User } from '../../interface/user';
import { UserService } from '../../services/user.service';
import { MatTabsModule } from '@angular/material/tabs';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { UserComponent } from '../user/user.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-side-user',
  imports: [MatTabsModule,MatProgressSpinnerModule,MatIconModule,UserComponent,CommonModule],
  templateUrl: './side-user.component.html',
  styleUrl: './side-user.component.css'
})
export class SideUserComponent {

  users: User[] = [];
  selectedTab = 0;
  loading = false;
  error : string | null = null;

  constructor(private router: Router,private userService:UserService) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.loading = true;
    this.error = null;
    this.userService.getAllUsers().subscribe({
      next: (users) =>{
        this.users = users;
        this.loading = false;
      },
      error: (err) =>{
        console.error('Failed to load users', err);
        this.error = 'Failed to load users';
        this.loading = false;
      }
    });
  }

  get filteredUsers(): User[] {
    return this.selectedTab === 0 
      ? this.users 
      : this.users.filter(user => user.isFriend);
  }

  sendFriendRequest(userId: number): void {
    this.router.navigate(['/profile', userId]);
    console.log('Friend request sent to user',userId);
  }

  viewProfile(userId: number): void {
    this.router.navigate(['/profile', userId]);
  }

}
