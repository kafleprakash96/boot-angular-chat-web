import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
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

  loadCurrentUser(): void {
    this.http.get<User>(`${this.profileApiUrl}/current`)
      .subscribe(user => this.currentUserSubject.next(user));
  }

  //Todo
  getUserProfile(username: string): Observable<User> {
    return this.http.get<User>(`${this.profileApiUrl}/${username}`);
  }

  updateProfile(userData: Partial<User>): Observable<User> {
    return this.http.put<User>(`${this.profileApiUrl}/profile`, userData)
      .pipe(tap(user => this.currentUserSubject.next(user)));
  }

  updateProfilePicture(file: File): Observable<User> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.put<User>(`${this.profileApiUrl}/profile-picture`, formData)
      .pipe(tap(user => this.currentUserSubject.next(user)));
  }
}
