import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { User } from '../interface/user';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  private readonly profileApiUrl = 'http://localhost:8080/api/v1/profile';
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient) {
    this.loadCurrentUser();
  }

  private getAuthHeaders(): HttpHeaders {
    const token = this.getToken();
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }

  loadCurrentUser(): void {
    const options = { headers: this.getAuthHeaders() };
    
    this.http.get<User>(`${this.profileApiUrl}/current`, options).subscribe({
      next: (user) => {
        if (user.profilePicture) {
          user.profilePicture = this.getProfilePictureUrl(user.profilePicture);
        }
        this.currentUserSubject.next(user);
      },
      error: () => this.currentUserSubject.next(null)
    });
  }

  getProfilePictureUrl(relativePath: string | null): string {
    if (!relativePath) {
      return 'assets/default-avatar.png';
    }
    return relativePath.startsWith('http') 
      ? relativePath 
      : `http://localhost:8080${relativePath}`;  // Use full backend URL
  }

  getUserProfile(username: string): Observable<User> {
    // Public endpoint - no authentication required
    return this.http.get<User>(`${this.profileApiUrl}/${username}`).pipe(
      tap(user => {
        if (user.profilePicture) {
          user.profilePicture = this.getProfilePictureUrl(user.profilePicture);
        }
      })
    );
  }

  updateProfile(userData: Partial<User>): Observable<User> {
    const options = { headers: this.getAuthHeaders() };
    
    return this.http.put<User>(`${this.profileApiUrl}/profile`, userData, options)
      .pipe(
        tap(user => {
          if (user.profilePicture) {
            user.profilePicture = this.getProfilePictureUrl(user.profilePicture);
          }
          this.currentUserSubject.next(user);
        })
      );
  }

  updateProfilePicture(file: File): Observable<User> {
    const formData = new FormData();
    formData.append('file', file);

    const options = { headers: new HttpHeaders({
      'Authorization': `Bearer ${this.getToken()}`
      // Don't set Content-Type here - browser will set it automatically with boundary for multipart/form-data
    })};

    return this.http.put<User>(`${this.profileApiUrl}/profile-picture`, formData, options)
      .pipe(
        tap(user => {
          if (user.profilePicture) {
            user.profilePicture = this.getProfilePictureUrl(user.profilePicture);
          }
          this.currentUserSubject.next(user);
        })
      );
  }

  private getToken(): string {
    return localStorage.getItem('token') || '';
  }
}