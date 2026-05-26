import { Injectable } from '@angular/core';
import { SupabaseService } from './supabase.service';

export interface RegisterData {
  email: string;
  password: string;
  nombre: string;
  apellido: string;
  edad: number;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private supabaseService: SupabaseService) {}

  async register(data: RegisterData) {
    const { data: authData, error: authError } =
      await this.supabaseService.client.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            nombre: data.nombre,
            apellido: data.apellido,
            edad: data.edad
          }
        }
      });

    if (authError) {
      throw new Error(this.getFriendlyError(authError.message));
    }

    const user = authData.user;

    if (!user) {
      throw new Error('No se pudo crear el usuario.');
    }

    const { error: dbError } =
      await this.supabaseService.client
        .from('usuarios')
        .insert({
          id: user.id,
          email: data.email,
          nombre: data.nombre,
          apellido: data.apellido,
          edad: data.edad
        });

    if (dbError) {
      throw new Error(this.getFriendlyError(dbError.message));
    }

    return authData;
  }

  async login(email: string, password: string) {
    const { data, error } =
      await this.supabaseService.client.auth.signInWithPassword({
        email,
        password
      });

    if (error) {
      throw new Error(this.getFriendlyError(error.message));
    }

    return data;
  }

  async logout() {
    const { error } = await this.supabaseService.client.auth.signOut();

    if (error) {
      throw new Error(this.getFriendlyError(error.message));
    }
  }

  async getCurrentUser() {
    const { data, error } =
      await this.supabaseService.client.auth.getSession();

    if (error || !data.session?.user) {
      return null;
    }

    return data.session.user;
  }

  async getCurrentUserProfile() {
    const user = await this.getCurrentUser();

    if (!user) {
      return null;
    }

    const { data, error } =
      await this.supabaseService.client
        .from('usuarios')
        .select('*')
        .eq('id', user.id)
        .maybeSingle();

    if (error || !data) {
      return {
        id: user.id,
        email: user.email,
        nombre: user.user_metadata?.['nombre'] || user.email,
        apellido: user.user_metadata?.['apellido'] || '',
        edad: user.user_metadata?.['edad'] || null
      };
    }

    return data;
  }

  async isLoggedIn(): Promise<boolean> {
    const { data, error } =
      await this.supabaseService.client.auth.getSession();

    if (error) {
      return false;
    }

    return !!data.session;
  }

  onAuthStateChange(callback: () => void) {
    return this.supabaseService.client.auth.onAuthStateChange(() => {
      setTimeout(() => {
        callback();
      }, 0);
    });
  }

  private getFriendlyError(message: string): string {
    const normalizedMessage = message.toLowerCase();

    if (
      normalizedMessage.includes('user already registered') ||
      normalizedMessage.includes('already registered') ||
      normalizedMessage.includes('already been registered')
    ) {
      return 'El usuario ya se encuentra registrado.';
    }

    if (
      normalizedMessage.includes('duplicate key') ||
      normalizedMessage.includes('violates unique constraint')
    ) {
      return 'El usuario ya se encuentra registrado.';
    }

    if (normalizedMessage.includes('invalid login credentials')) {
      return 'Email o contraseña incorrectos.';
    }

    if (normalizedMessage.includes('password should be')) {
      return 'La contraseña debe tener al menos 6 caracteres.';
    }

    if (normalizedMessage.includes('unable to validate email address')) {
      return 'El email ingresado no es válido.';
    }

    if (normalizedMessage.includes('email rate limit exceeded')) {
      return 'Se hicieron muchos intentos seguidos. Esperá unos minutos y volvé a intentar.';
    }

    if (normalizedMessage.includes('signup is disabled')) {
      return 'El registro de usuarios está deshabilitado.';
    }

    return 'Ocurrió un error. Intentá nuevamente.';
  }
}