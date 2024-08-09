import { Component, Inject, OnInit } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { AuthService } from '@auth0/auth0-angular';
import { CommonModule, DOCUMENT } from '@angular/common';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [RouterOutlet, CommonModule],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.css',
})
export class LayoutComponent implements OnInit {
  constructor(
    private router: Router,
    @Inject(DOCUMENT) public document: Document,
    public auth: AuthService
  ) {}

  ngOnInit() {
    if (!this.auth.isAuthenticated$ && localStorage.getItem('user'))
      this.router.navigate(['login']);
  }

  logout() {
    localStorage.removeItem('user');
    this.auth.logout();
    this.router.navigate(['login']);
  }
}
