import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PostsService {
  private baseUrl = 'http://localhost:3000/posts';

  constructor(private http: HttpClient) {}

  getPosts(): Observable<any> {
    return this.http.get<any>(this.baseUrl);
  }

  getPostById(id: string) {
    return this.http.get(`${this.baseUrl}/${id}`);
  }

  addPost(post: any) {
    return this.http.post(`${this.baseUrl}`, post);
  }
}
