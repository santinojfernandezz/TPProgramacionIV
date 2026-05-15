import { Injectable } from '@angular/core';
import { SupabaseService } from './supabase.service';
import { AuthService } from './auth.service';

export interface GameResult {
  juego: string;
  resultado: 'victoria' | 'derrota';
  puntaje: number;
  tiempo_segundos?: number;
  datos?: any;
}

@Injectable({
  providedIn: 'root'
})
export class GameResultsService {

  constructor(
    private supabaseService: SupabaseService,
    private authService: AuthService
  ) {}

  async saveResult(result: GameResult) {
    const user = await this.authService.getCurrentUser();

    if (!user) {
      throw new Error('No hay usuario logueado.');
    }

    const { error } = await this.supabaseService.client
      .from('resultados_juegos')
      .insert({
        usuario_id: user.id,
        juego: result.juego,
        resultado: result.resultado,
        puntaje: result.puntaje,
        tiempo_segundos: result.tiempo_segundos ?? null,
        datos: result.datos ?? {}
      });

    if (error) {
      console.error('Error guardando resultado:', error);
      throw new Error('No se pudo guardar el resultado.');
    }
  }
}