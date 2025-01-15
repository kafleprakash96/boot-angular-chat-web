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
  imports: [RoomCardComponent,
    FormsModule,
    NgFor,
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

  joinRoom(room: any) {
    // Implement room joining logic
  }

  logout() {
    // Implement logout logic
  }

}
