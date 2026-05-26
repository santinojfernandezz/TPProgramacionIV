import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';
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
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './register.html',
  styleUrls: ['./register.scss']
})
export class RegisterComponent {

  loading = signal<boolean>(false);
  errorMessage = signal<string>('');

  form: FormGroup;

  private onlyLettersPattern = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      nombre: ['', [
        Validators.required,
        Validators.minLength(2),
        Validators.pattern(this.onlyLettersPattern)
      ]],
      apellido: ['', [
        Validators.required,
        Validators.minLength(2),
        Validators.pattern(this.onlyLettersPattern)
      ]],
      edad: [null, [
        Validators.required,
        Validators.min(18),
        Validators.max(99)
      ]],
      password: ['', [
        Validators.required,
        Validators.minLength(6)
      ]]
    });
  }

  async onSubmit() {
    this.errorMessage.set('');

    if (this.form.invalid || this.loading()) {
      this.form.markAllAsTouched();
      this.errorMessage.set('Revisá los campos marcados antes de continuar.');
      return;
    }

    this.loading.set(true);

    try {
      await this.authService.register(this.form.value);
      await this.router.navigate(['/home']);
    } catch (error: any) {
      this.errorMessage.set(error.message || 'No se pudo registrar el usuario.');
    } finally {
      this.loading.set(false);
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

  getNombreError(): string {
    const nombre = this.getField('nombre');

    if (nombre?.hasError('required')) {
      return 'El nombre es obligatorio.';
    }

    if (nombre?.hasError('minlength')) {
      return 'El nombre debe tener al menos 2 caracteres.';
    }

    if (nombre?.hasError('pattern')) {
      return 'El nombre solo puede contener letras.';
    }

    return '';
  }

  getApellidoError(): string {
    const apellido = this.getField('apellido');

    if (apellido?.hasError('required')) {
      return 'El apellido es obligatorio.';
    }

    if (apellido?.hasError('minlength')) {
      return 'El apellido debe tener al menos 2 caracteres.';
    }

    if (apellido?.hasError('pattern')) {
      return 'El apellido solo puede contener letras.';
    }

    return '';
  }

  getEdadError(): string {
    const edad = this.getField('edad');

    if (edad?.hasError('required')) {
      return 'La edad es obligatoria.';
    }

    if (edad?.hasError('min')) {
      return 'La edad debe ser mayor o igual a 18.';
    }

    if (edad?.hasError('max')) {
      return 'La edad debe ser menor o igual a 99.';
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