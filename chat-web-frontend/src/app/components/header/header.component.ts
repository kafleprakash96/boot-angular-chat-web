import { Component, OnInit, Input,Output,EventEmitter, ViewChild, TemplateRef} from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbar } from '@angular/material/toolbar';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';

@Component({
  selector: 'app-header',
  imports: [HeaderComponent,
    MatIconModule,MatToolbar,CommonModule,MatButtonModule,MatDialogModule,RouterLink],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent  implements OnInit{
  @Input() isLoggedIn: boolean = false;
  @Input() title: string = 'GuffChautari';

  @Output() toggleSidenav = new EventEmitter<void>();

  @ViewChild('logoutDialog') logoutDialog!: TemplateRef<any>;

  constructor(
    private matDialog : MatDialog,
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

  openLogoutDialog() {
    const dialogRef = this.matDialog.open(this.logoutDialog, {
      width: '400px',
      disableClose: true,
      autoFocus: false,
      panelClass: 'logout-dialog'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === 'confirm') {
        this.logout();
      }
    });
  }

  confirmLogout() {
    this.matDialog.closeAll();
    this.logout();
  }
}
