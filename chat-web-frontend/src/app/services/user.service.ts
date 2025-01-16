import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { User } from '../interface/user';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  
    private apiUrl = 'http://localhost:8080/api/profile';
  
    constructor(
      private http: HttpClient,
      private authService: AuthService
    ) {}
  
    getCurrentUser(): Observable<User> {
      return this.http.get<User>(`${this.apiUrl}/current`).pipe(
        tap(user => {
          // Update the auth service with the latest user data
          localStorage.setItem('currentUser', JSON.stringify(user));
        })
      );
    }
  
    updateProfile(userData: Partial<User>): Observable<User> {
      return this.http.put<User>(`${this.apiUrl}/profile`, userData).pipe(
        tap(updatedUser => {
          // Update stored user data
          localStorage.setItem('currentUser', JSON.stringify(updatedUser));
        })
      );
    }
  
    updateProfilePicture(file: File): Observable<User> {
      const formData = new FormData();
      formData.append('file', file);
      return this.http.put<User>(`${this.apiUrl}/profile-picture`, formData).pipe(
        tap(updatedUser => {
          // Update stored user data
          localStorage.setItem('currentUser', JSON.stringify(updatedUser));
        })
      );
    }
}
