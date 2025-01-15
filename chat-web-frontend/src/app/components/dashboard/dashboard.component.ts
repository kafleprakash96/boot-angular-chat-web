import { Component,OnInit } from '@angular/core';

import {Room} from '../../interface/room';
import {RoomService} from '../../services/room.service';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { RoomCardComponent } from '../room-card/room-card.component';
import { FormsModule, NgModel } from '@angular/forms';
import { NgFor, NgIf } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { MatDialog } from '@angular/material/dialog';
import { RoomCreateDialogComponent } from '../room-create-dialog/room-create-dialog.component';
import { MatCard, MatCardMdImage, MatCardModule } from '@angular/material/card';
import { MatToolbar, MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';


@Component({
  selector: 'app-dashboard',
  imports: [MatFormField,RoomCardComponent,
    MatLabel,
    FormsModule,
    NgFor,NgIf,
    MatCardModule,MatToolbarModule,MatButtonModule,MatIconModule,MatMenuModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {

  rooms: any[] = [];
  newRoomName: string = '';
  username: string = '';
  searchText: string = '';

  constructor(
    private roomService: RoomService,
    private dialog: MatDialog,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit() {
    
    this.username = this.authService.currentUser?.username || '';
    this.loadRooms();
  }

  loadRooms() {
    this.roomService.getAllRooms().subscribe({
      next: (data) => {
        this.rooms = data;
      },
      error: (error) => {
        console.error('Error loading rooms:', error);
      }
    });
  }

  openCreateRoomDialog() {
    const dialogRef = this.dialog.open(RoomCreateDialogComponent, {
      width: '250px',
      data: { username: this.username }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.roomService.createRoom(result.name).subscribe({
          next: (room) => {
            this.rooms.push(room);
          },
          error: (error) => console.error('Error creating room:', error)
        });
      }
    });
  }

  createRoom(): void {
    const dialogRef = this.dialog.open(RoomCreateDialogComponent);

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.router.navigate(['/dashboard']);
        console.log('Room created successfully:', result);
      }
    });
  }

  joinRoom(room: any) {
    // Implement room joining logic
  }

  logout() {
    // Implement logout logic
  }

}
