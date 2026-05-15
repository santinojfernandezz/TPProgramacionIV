import { Component, inject, signal, OnInit } from '@angular/core';
import { GithubService } from '../../core/services/github.service';

@Component({
  selector: 'app-quien-soy',
  standalone: true,
  templateUrl: './quien-soy.html',
  styleUrl: './quien-soy.scss'
})
export class QuienSoy implements OnInit {

  private githubService = inject(GithubService);

  profile = signal<any>(null);

  ngOnInit(): void {
    this.githubService
      .getProfile('santinojfernandezz')
      .subscribe({
        next: (data) => this.profile.set(data),
        error: (err) => console.error(err)
      });
  }
}