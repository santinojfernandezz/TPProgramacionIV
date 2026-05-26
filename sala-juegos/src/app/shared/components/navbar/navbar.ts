import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, computed, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './navbar.html',
  styleUrls: ['./navbar.scss']
})
export class NavbarComponent implements OnInit, OnDestroy {

  userProfile = signal<any>(null);

  userName = computed(() => {
    return this.userProfile()?.nombre || this.userProfile()?.email || 'Jugador';
  });

  private authSubscription: any = null;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadUserProfile();

    const { data } = this.authService.onAuthStateChange(() => {
      this.loadUserProfile();
    });

    this.authSubscription = data.subscription;
  }

  ngOnDestroy() {
    if (this.authSubscription) {
      this.authSubscription.unsubscribe();
    }
  }

  async loadUserProfile() {
    try {
      const profile = await this.authService.getCurrentUserProfile();
      this.userProfile.set(profile);
    } catch (error) {
      console.error('Error cargando usuario en Navbar:', error);
      this.userProfile.set(null);
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