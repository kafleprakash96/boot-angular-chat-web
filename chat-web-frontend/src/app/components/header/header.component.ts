import { Component, OnInit, Input,Output,EventEmitter} from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbar } from '@angular/material/toolbar';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-header',
  imports: [MatIconModule,MatToolbar,CommonModule,MatButtonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent  implements OnInit{
  
  @Input() isLoggedIn: boolean = false;
  @Input() title: string = 'GuffChautari';

  @Output() toggleSidenav = new EventEmitter<void>();

  constructor(
    private router: Router,
    private authService: AuthService
  ) {}

  

  ngOnInit() {
    this.isLoggedIn = this.authService.isLoggedIn();
  }

  navigate(path: string) {
    this.router.navigate([path]);
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
    
  }

  onToggleSidenav(){
    console.log("Side nav toggled");
  }

}
