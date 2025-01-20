import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders } from '@angular/common/http';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PostService {

  private postApiUrl = "http://localhost:8080/api/v1/posts";

  constructor(private http: HttpClient) {}

  // Get all public posts (no auth required)
  getPublicPosts(): Observable<any[]> {
    return this.http.get<any[]>(`${this.postApiUrl}/public`);
  }

  // Get posts for authenticated users
  getPosts(): Observable<any[]> {
    const headers = new HttpHeaders().set(
      'Authorization',
      `Bearer ${this.getToken()}`
    );
    return this.http.get<{content: any[]}>(this.postApiUrl,{headers}).pipe
    (map(response => response.content));
  }

  // Create a new post
  createPost(postData: { content: string }): Observable<any> {
    const headers = new HttpHeaders().set(
      'Authorization',
      `Bearer ${this.getToken()}`
    );
    return this.http.post(`${this.postApiUrl}/create`, postData, { headers });
  }
  

  // Like a post
  likePost(postId: string): Observable<any> {
    return this.http.post(`${this.postApiUrl}/${postId}/like`, {});
  }

  // Add comment
  addComment(postId: string, comment: string): Observable<any> {
    return this.http.post(`${this.postApiUrl}/${postId}/comments`, { content: comment });
  }

  private getToken(): string {
    return localStorage.getItem('token') || '';
  }
}
