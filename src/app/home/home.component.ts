import { Component, OnInit } from '@angular/core';
import { PostsService } from '../services/posts.service';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AuthService, User } from '@auth0/auth0-angular';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent implements OnInit {
  posts: any[] = [];
  ePosts: any[] = [];
  filteredPosts: any[] = [];
  searchValue = '';

  constructor(private postsService: PostsService, public auth: AuthService) {}

  profileJson: string = '';
  email: User | null | undefined;

  ngOnInit(): void {
    console.log('Auth user', this.auth.user$);
    this.auth.user$.subscribe(
      (profile) => (this.profileJson = JSON.stringify(profile))
    );
    console.log('Auth user', this.email);
    this.postsService.getPosts().subscribe((posts) => {
      this.posts = posts;
      this.filteredPosts = posts;
      this.ePosts = this.posts.filter((post) => post.status === 3);
    });
  }

  filterPosts(status: number) {
    if (status === 0) this.filteredPosts = this.posts;
    else
      this.filteredPosts = this.posts.filter((post) => post.status === status);
    this.searchValue = '';
  }

  extractTextFromFirstTag(htmlString: string): string {
    const regex = /<(\w+)>(.*?)<\/\1>/;
    const match = htmlString.match(regex);

    if (match) {
      return match[2];
    } else {
      return '';
    }
  }

  formatDate(isoString: string): string {
    const date = new Date(isoString);
    const options: Intl.DateTimeFormatOptions = {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    };

    return date.toLocaleDateString('en-US', options);
  }

  searchPosts(query: any) {
    query = query.value;
    if (query) {
      this.filteredPosts = this.posts.filter((post) =>
        post.title.toLowerCase().includes(query.toLowerCase())
      );
    } else {
      this.filteredPosts = this.posts;
    }
  }
}
