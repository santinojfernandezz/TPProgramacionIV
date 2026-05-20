import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { GithubProfile } from '../models/github-profile.model';
import { Observable, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GithubService {

  private http = inject(HttpClient);

  getProfile(username: string): Observable<GithubProfile> {
  return this.http
    .get<GithubProfile>(`https://api.github.com/users/${username}`)
    .pipe(
      map(profile => ({
        login: profile.login,
        name: profile.name,
        bio: profile.bio,
        avatar_url: profile.avatar_url,
        html_url: profile.html_url,
        public_repos: profile.public_repos,
        followers: profile.followers,
        following: profile.following
      }))
    );
}
}