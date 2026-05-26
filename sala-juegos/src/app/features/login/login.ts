import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {
  AbstractControl,
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
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  async onSubmit() {
    this.errorMessage = '';

    if (this.form.invalid || this.loading) {
      this.form.markAllAsTouched();
      this.errorMessage = 'Revisá los campos marcados antes de continuar.';
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

  isInvalid(field: string): boolean {
    const control = this.form.get(field);
    return !!control && control.invalid && (control.touched || control.dirty);
  }

  getField(field: string): AbstractControl | null {
    return this.form.get(field);
  }

  getEmailError(): string {
    const email = this.getField('email');

    if (email?.hasError('required')) {
      return 'El email es obligatorio.';
    }

    if (email?.hasError('email')) {
      return 'Ingresá un email válido.';
    }

    return '';
  }

  getPasswordError(): string {
    const password = this.getField('password');

    if (password?.hasError('required')) {
      return 'La contraseña es obligatoria.';
    }

    if (password?.hasError('minlength')) {
      return 'La contraseña debe tener al menos 6 caracteres.';
    }

    return '';
  }
}