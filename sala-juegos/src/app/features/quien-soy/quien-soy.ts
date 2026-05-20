import { Component, inject, signal, OnInit } from '@angular/core';
import { GithubService } from '../../core/services/github.service';
import { GithubProfile } from '../../core/models/github-profile.model';

@Component({
  selector: 'app-quien-soy',
  standalone: true,
  templateUrl: './quien-soy.html',
  styleUrl: './quien-soy.scss'
})
export class QuienSoy implements OnInit {

  private githubService = inject(GithubService);

  profile = signal<GithubProfile | null>(null);

  ngOnInit(): void {
    this.githubService
      .getProfile('santinojfernandezz')
      .subscribe({
        next: (data) => this.profile.set(data),
        error: (err) => console.error(err)
      });
  }
}