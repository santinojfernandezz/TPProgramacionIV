import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class GithubService {

  private http = inject(HttpClient);

  getProfile(username: string) {
    return this.http.get(`https://api.github.com/users/${username}`);
  }
}