import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { PostsService } from '../services/posts.service';
import { NgFor, NgIf } from '@angular/common';
import { DatePipe } from '@angular/common';
import { CommentsService } from '../services/comments.service';
import { FormsModule } from '@angular/forms';

interface Comment {
  id: string;
  parent: string | null;
  author: string;
  comment: string;
  postId: string;
  date: string;
  replies?: Comment[]; // replies is optional
}

@Component({
  selector: 'app-view',
  standalone: true,
  imports: [NgFor, NgIf, DatePipe, FormsModule],
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.css'],
})
export class ViewComponent implements OnInit {
  post: any;
  comments: Comment[] = [];
  showComments = false;
  postId: string | null = null;
  newCommentText: string = '';
  replyTo: string | null = null;
  replyingTo: string | null = null; // Track which comment/reply is being replied to

  constructor(
    private route: ActivatedRoute,
    private postsService: PostsService,
    private commentsService: CommentsService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params: Params) => {
      const id = params['id'];
      this.postsService.getPostById(id).subscribe((post) => {
        this.post = post;
      });
    });

    this.route.paramMap.subscribe((params) => {
      this.postId = params.get('id');
      if (this.postId) {
        this.commentsService.getComments(this.postId).subscribe((data) => {
          this.comments = this.buildCommentTree(data);
        });
      }
    });
  }

  buildCommentTree(comments: Comment[]): Comment[] {
    const map = new Map<string, Comment>();
    comments.forEach((comment) =>
      map.set(comment.id, { ...comment, replies: [] })
    );
    const result: Comment[] = [];

    comments.forEach((comment) => {
      if (comment.parent) {
        map.get(comment.parent)?.replies?.push(map.get(comment.id)!);
      } else {
        result.push(map.get(comment.id)!);
      }
    });

    return result;
  }

  toggleComments() {
    this.showComments = !this.showComments;
  }

  addComment(): void {
    if (this.newCommentText.trim()) {
      const parentId = this.replyingTo; // Use replyingTo to track the reply target
      this.commentsService
        .addComment(this.postId!, this.newCommentText, parentId)
        .subscribe((newComment) => {
          if (parentId) {
            const parentComment = this.findCommentById(this.comments, parentId);
            if (parentComment) {
              parentComment.replies = parentComment.replies || [];
              parentComment.replies.push(newComment);
            }
          } else {
            this.comments.push(newComment);
          }
          this.newCommentText = ''; // Clear input after submission
          this.replyingTo = null; // Reset replying state
        });
    }
  }

  findCommentById(comments: Comment[], commentId: string): Comment | undefined {
    for (let comment of comments) {
      if (comment.id === commentId) {
        return comment;
      }
      if (comment.replies) {
        const found = this.findCommentById(comment.replies, commentId);
        if (found) return found;
      }
    }
    return undefined;
  }

  setReplyTo(commentId: string): void {
    this.replyingTo = this.replyingTo === commentId ? null : commentId; // Toggle replying state
  }
}
