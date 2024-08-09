import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { PostsService } from '../services/posts.service';
import { NgFor } from '@angular/common';

@Component({
  selector: 'app-view',
  standalone: true,
  imports: [NgFor],
  templateUrl: './view.component.html',
  styleUrl: './view.component.css',
})
export class ViewComponent implements OnInit {
  post: any;
  constructor(
    private route: ActivatedRoute,
    private postsService: PostsService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params: Params) => {
      const id = params['id'];
      this.postsService.getPostById(id).subscribe((post) => {
        this.post = post;
      });
    });
  }
}
