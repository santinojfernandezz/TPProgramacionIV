import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './home.html',
  styleUrl: './home.scss'
})
export class Home implements OnInit, OnDestroy {

  userProfile = signal<any>(null);
  loading = signal<boolean>(true);

  private authSubscription: any = null;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadUser();

    const { data } = this.authService.onAuthStateChange(() => {
      this.loadUser();
    });

    this.authSubscription = data.subscription;
  }

  ngOnDestroy() {
    if (this.authSubscription) {
      this.authSubscription.unsubscribe();
    }
  }

  async loadUser() {
    this.loading.set(true);

    try {
      const profile = await this.authService.getCurrentUserProfile();
      this.userProfile.set(profile);
    } catch (error) {
      console.error('Error cargando usuario en Home:', error);
      this.userProfile.set(null);
    } finally {
      this.loading.set(false);
    }
  }

  async logout() {
    try {
      await this.authService.logout();
      this.userProfile.set(null);
      await this.router.navigate(['/home']);
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  }
}