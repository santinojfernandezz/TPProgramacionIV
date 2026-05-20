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
        password: data.password
      });

    if (authError) {
      console.error('Error Supabase Auth:', authError);
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
      console.error('Error Supabase DB:', dbError);
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
      console.error('Error Supabase Login:', error);
      throw new Error(this.getFriendlyError(error.message));
    }

    return data;
  }

  async logout() {
    const { error } = await this.supabaseService.client.auth.signOut();

    if (error) {
      console.error('Error Supabase Logout:', error);
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

    if (error) {
      console.error('Error obteniendo perfil:', error);
    }

    if (!data) {
      return {
        id: user.id,
        email: user.email,
        nombre: user.email
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

  private getFriendlyError(message: string): string {
    if (message.includes('Invalid login credentials')) {
      return 'Email o contraseña incorrectos.';
    }

    if (message.includes('User already registered')) {
      return 'El usuario ya se encuentra registrado.';
    }

    if (message.includes('already been registered')) {
      return 'El usuario ya se encuentra registrado.';
    }

    if (message.includes('Password should be')) {
      return 'La contraseña debe tener al menos 6 caracteres.';
    }

    if (message.includes('Unable to validate email address')) {
      return 'El email ingresado no es válido.';
    }

    if (message.includes('Signup is disabled')) {
      return 'El registro de usuarios está deshabilitado en Supabase.';
    }

    if (message.includes('email rate limit exceeded')) {
      return 'Se hicieron muchos intentos de registro seguidos. Esperá unos minutos y volvé a intentar.';
    }

    return message;
  }
}