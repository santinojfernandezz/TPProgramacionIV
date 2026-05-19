import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './home.html',
  styleUrl: './home.scss'
})
export class Home implements OnInit {

  userProfile: any = null;
  loading = true;

  constructor(
    private authService: AuthService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  async ngOnInit() {
    await this.loadUser();
  }

  async loadUser() {
    this.loading = true;

    try {
      this.userProfile = await this.authService.getCurrentUserProfile();
    } catch (error) {
      this.userProfile = null;
    } finally {
      this.loading = false;
      this.cdr.detectChanges();
    }
  }

  async logout() {
    try {
      await this.authService.logout();

      this.userProfile = null;
      this.loading = false;

      this.cdr.detectChanges();

      await this.router.navigate(['/home']);
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  }
}