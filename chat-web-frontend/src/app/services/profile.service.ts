import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, tap, map } from 'rxjs';
import { User } from '../interface/user';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  private readonly profileApiUrl = 'http://localhost:8080/api/v1/profile';
  private currentUserSubject : BehaviorSubject<User|null>= new BehaviorSubject<User | null>(null);
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
        if (user.profilePictureUrl) {
          user.profilePictureUrl = this.getImageUrl(user.username,'profile');
          user.coverPictureUrl = this.getImageUrl(user.username, 'cover');
        }
        this.currentUserSubject.next(user);
      },
      error: () => this.currentUserSubject.next(null)
    });
  }

  getImageUrl(username: string, type: 'profile' | 'cover'): string {
    if (!username) {
      return type === 'profile' ? 'assets/default-avatar.png' : 'assets/default-cover.png';
    }
    return `${this.profileApiUrl}/image/${username}/${type}`;
  }

  getUserProfile(userId: number): Observable<User> {
    const options = { headers: this.getAuthHeaders() };
    return this.http.get<User>(`${this.profileApiUrl}/${userId}`,options).pipe(
      map(user => {
        if (user.id) {
          user.profilePictureUrl = this.getImageUrl(user.username, 'profile');
          user.coverPictureUrl = this.getImageUrl(user.username, 'cover');
        }
        return user;
      })
    );
  }

  updateProfile(userData: Partial<User>): Observable<User> {
    const options = { headers: this.getAuthHeaders() };
    
    return this.http.put<User>(`${this.profileApiUrl}/profile`, userData, options)
      .pipe(
        tap(user => {
          if (user.profilePictureUrl) {
            user.profilePictureUrl = this.getImageUrl(user.username,'profile');
            user.profilePictureUrl = this.getImageUrl(user.username,'cover');
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
    })};

    return this.http.put<User>(`${this.profileApiUrl}/upload/profile-picture`, formData, options)
      .pipe(
        tap(user => {
          if (user.profilePictureUrl) {
            user.profilePictureUrl = this.getImageUrl(user.username,'profile');
          }
          this.currentUserSubject.next(user);
        })
      );
  }




  private getToken(): string {
    return localStorage.getItem('token') || '';
  }

  // updateCoverPicture(file: File): Observable<any> {
  //   const formData = new FormData();
  //   formData.append('file', file);

  //   const options = { headers: new HttpHeaders({
  //     'Authorization': `Bearer ${this.getToken()}`
  //     // Don't set Content-Type here - browser will set it automatically with boundary for multipart/form-data
  //   })};

  //   return this.http.put<any>(`${this.profileApiUrl}/upload/cover-picture`, formData,options)
  //     .pipe(
  //       tap(user => {
  //         // Update the current user in the behavior subject if it's the logged-in user
  //         if (this.currentUserSubject.value?.id === user.id) {
  //           this.currentUserSubject.next(user);
  //         }
  //       })
  //     );
  // }

  updateCoverPicture(file: File): Observable<User> {
    const formData = new FormData();
    formData.append('file', file);

    const options = { headers: new HttpHeaders({
      'Authorization': `Bearer ${this.getToken()}`
      // Don't set Content-Type here - browser will set it automatically with boundary for multipart/form-data
    })};

    return this.http.put<User>(`${this.profileApiUrl}/upload/cover-picture`, formData,options)
      .pipe(
        map(user => {
          if(user.username){
            user.coverPictureUrl = this.getImageUrl(user.username,'cover');
          }
          this.currentUserSubject.next(user);
          return user
        })
      );
        
  }


}