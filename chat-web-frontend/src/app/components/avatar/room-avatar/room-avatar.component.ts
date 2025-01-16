import { CommonModule } from '@angular/common';
import { Component,Input } from '@angular/core';

@Component({
  selector: 'app-room-avatar',
  imports: [CommonModule],
  templateUrl: './room-avatar.component.html',
  styleUrl: './room-avatar.component.css'
})
export class RoomAvatarComponent {
  @Input() roomName: string = '';
  @Input() size: 'small' | 'medium' | 'large' = 'medium';
  backgroundColor: string = '';
  textColor: string = '#ffffff';
  initials: string = '';

  ngOnInit(): void {
    this.initials = this.generateInitials();
    this.backgroundColor = this.generateColor();
  }

  private generateInitials(): string {
    if (!this.roomName) {
      return '?';
    }
    const words = this.roomName.trim().split(' ');
    if (words.length === 1) {
      return words[0].substring(0, 2).toUpperCase();
    }
    return (words[0].charAt(0) + words[words.length - 1].charAt(0)).toUpperCase();
  }

  private generateColor(): string {
    let hash = 0;
    for (let i = 0; i < this.roomName.length; i++) {
      hash = this.roomName.charCodeAt(i) + ((hash << 5) - hash);
    }

    const colors = [
      '#f44336', '#e91e63', '#9c27b0', '#673ab7',
      '#3f51b5', '#2196f3', '#03a9f4', '#00bcd4',
      '#009688', '#4caf50', '#8bc34a', '#cddc39',
      '#ffc107', '#ff9800', '#ff5722', '#795548'
    ];

    const index = Math.abs(hash % colors.length);
    return colors[index];
  }

  getSizeClass(): string {
    return `avatar-${this.size}`;
  }
}
