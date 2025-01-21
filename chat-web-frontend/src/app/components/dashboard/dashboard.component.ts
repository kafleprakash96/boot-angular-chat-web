import { Component,OnInit, ViewChild } from '@angular/core';

import {Room} from '../../interface/room';
import {RoomService} from '../../services/room.service';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { RoomCardComponent } from '../room-card/room-card.component';
import { FormsModule, NgModel } from '@angular/forms';
import { CommonModule, NgFor, NgIf } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { MatDialog } from '@angular/material/dialog';
import { RoomCreateDialogComponent } from '../room-create-dialog/room-create-dialog.component';
import { MatCard, MatCardMdImage, MatCardModule } from '@angular/material/card';
import { MatToolbar, MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { SideMenuComponent } from '../side-menu/side-menu.component';
import { HeaderComponent } from '../header/header.component';
import { MatSidenav, MatSidenavModule } from '@angular/material/sidenav';
import { PostService } from '../../services/post.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatTabsModule } from '@angular/material/tabs';
import { MatDividerModule } from '@angular/material/divider';
import { PostCardComponent } from '../post-card/post-card.component';
import { PostCreateDialogComponent } from '../post-create-dialog/post-create-dialog.component';


@Component({
  selector: 'app-dashboard',
  imports: [RoomCardComponent,
    CommonModule,
    FormsModule,
    NgFor,
    MatCardModule,
    MatTabsModule,
    MatFormFieldModule,
    MatDividerModule,
    PostCardComponent,
    MatSidenavModule,MatToolbarModule,MatButtonModule,MatIconModule,MatMenuModule,SideMenuComponent,HeaderComponent,PostCardComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {
  @ViewChild('sidenav') sidenav!: MatSidenav;

  rooms: any[] = [];
  newRoomName: string = '';
  username: string = '';
  searchText: string = '';
  posts: any[] = [];
  selectedTab = 0;

  constructor(
    private roomService: RoomService,
    private dialog: MatDialog,
    private router: Router,
    private authService: AuthService,
    private postService: PostService
  ) {}

  ngOnInit() {
    
    this.username = this.authService.currentUser?.username || '';
    if (this.selectedTab === 0) {
      this.loadRooms(); // Default to Chat Rooms
    } else if (this.selectedTab === 1) {
      this.loadPosts();
    }
  }

  loadRooms() {
    this.roomService.getAllRooms().subscribe(rooms =>{
      this.rooms = rooms;
    });
  }


  createRoom(): void {
    const dialogRef = this.dialog.open(RoomCreateDialogComponent, {
      width: '400px'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadRooms();
      }
    });
  }

  // loadPosts() {
  //   this.postService.getPosts().subscribe(posts => {
  //     this.posts = posts;
  //   });
  // }

  
  //Todo
  loadPosts() {
    this.postService.getPosts().subscribe(
      (response: any) => {
        this.posts = response.map((post: any) => ({
          id: post.id,
          title: post.title || 'Untitled Post', // Fallback title if none exists
          content: post.content,
          author: post.author || 'Anonymous',
          likes: post.likes || 0,
          comments: post.comments || [],
          createdAt: new Date(post.createdAt),
          isLiked: post.isLiked || false
        }));
      },
      error => console.error('Error loading posts:', error)
    );
  }

  createPost() {
    const dialogRef = this.dialog.open(PostCreateDialogComponent, {
      width: '400px'
    });
    
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadPosts();
      }
    });
  }

  likePost(postId: string) {
    this.postService.likePost(postId).subscribe(
      response => {
        // Update post in the posts array
        const postIndex = this.posts.findIndex(p => p.id === postId);
        if (postIndex !== -1) {
          this.posts[postIndex] = { ...this.posts[postIndex], ...response };
        }
      }
    );
  }

  addComment(postId: string, comment: string) {
    this.postService.addComment(postId, comment).subscribe(
      response => {
        // Update post comments in the posts array
        const postIndex = this.posts.findIndex(p => p.id === postId);
        if (postIndex !== -1) {
          this.posts[postIndex] = { ...this.posts[postIndex], ...response };
        }
      }
    );
  }
  addReply(postId: string, commentId: string, reply: string) {
    //Todo
    console.log("reply added")
  }

  joinRoom(room: any) {
    // Implement room joining logic
  }

  logout() {
    // Implement logout logic
  }

  navigateToProfile() {
    this.router.navigate(['/profile']);
  }

  onToggleSidenav(): void {
    console.log("side menu clicked")
    this.sidenav.toggle();
  }

  onTabChange(index: number) {

    this.selectedTab = index;
    if (this.selectedTab === 0) {
      this.loadRooms();
    }
    else if (this.selectedTab === 1) {
      this.loadPosts();
    }
  }

}
