import { Component } from '@angular/core';
import { Room } from '../../interface/room';
import { Router } from '@angular/router';
import { Input } from '@angular/core';
import { MatCard, MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-room-card',
  imports: [MatCardModule],
  templateUrl: './room-card.component.html',
  styleUrl: './room-card.component.css'
})
export class RoomCardComponent {

  @Input() room!: Room;

  constructor(private router: Router) {}

  navigateToChat() {
    this.router.navigate(['/chat', this.room.id]);
  }

}