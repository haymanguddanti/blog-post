import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { AuthService } from '@auth0/auth0-angular'; // Import AuthService
interface Comment {
  id: string;
  parent: string | null;
  author: string;
  comment: string;
  postId: string;
  date: string;
  replies?: Comment[]; // replies is optional
}

@Injectable({
  providedIn: 'root',
})
export class CommentsService {
  private apiUrl = 'https://blog-post-db-tau.vercel.app/comments'; // Your API URL

  constructor(private http: HttpClient, private auth: AuthService) {}

  // Function to get comments for a specific postId
  getComments(postId: string): Observable<Comment[]> {
    return this.http
      .get<Comment[]>(this.apiUrl)
      .pipe(
        map((comments) =>
          comments.filter((comment) => comment.postId === postId)
        )
      );
  }

  // Function to add a new comment or reply
  addComment(
    postId: string,
    commentText: string,
    parentId: string | null
  ): Observable<Comment> {
    return this.auth.user$.pipe(
      switchMap((user) => {
        const newComment: Comment = {
          id: this.generateId(),
          parent: parentId,
          author: user?.name || user?.nickname || user?.email || 'Annonymous',
          comment: commentText,
          postId: postId,
          date: new Date().toLocaleDateString('en-GB', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
          }),
        };

        return this.http.post<Comment>(this.apiUrl, newComment);
      })
    );
  }

  private generateId(): string {
    return Math.random().toString(36).substring(2, 9);
  }
}
