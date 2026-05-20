import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.scss'
})
export class Login {

  loading = false;
  errorMessage = '';
  form: FormGroup;

  quickUsers = [
    { label: 'Jugador 1', email: 'jugadoruno@gmail.com', password: '123456' },
    { label: 'Jugador 2', email: 'jugadordos@gmail.com', password: '123456' },
    { label: 'Jugador 3', email: 'jugadortres@gmail.com', password: '123456' }
  ];

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  async onSubmit() {
    if (this.form.invalid || this.loading) {
      this.errorMessage = 'Completá email y contraseña correctamente.';
      return;
    }

    await this.executeLogin(
      this.form.value.email,
      this.form.value.password
    );
  }

  async quickLogin(user: { email: string; password: string }) {
    this.form.patchValue({
      email: user.email,
      password: user.password
    });

    await this.executeLogin(user.email, user.password);
  }

  private async executeLogin(email: string, password: string) {
    this.loading = true;
    this.errorMessage = '';

    try {
      await this.authService.login(email, password);
      await this.router.navigate(['/home']);
    } catch (error: any) {
      this.errorMessage = error.message || 'No se pudo iniciar sesión.';
    } finally {
      this.loading = false;
    }
  }
}