import { Injectable } from '@angular/core';
import { SupabaseService } from './supabase.service';

export interface ResultadoJuego {
  id?: number;
  usuario_id: string;
  juego: string;
  resultado: string;
  puntaje: number;
  tiempo_segundos?: number | null;
  datos?: any;
  created_at?: string;
}

export interface UsuarioResultado {
  nombre: string;
  apellido: string;
  email: string;
}

export interface ResultadoConUsuario extends ResultadoJuego {
  usuarios?: UsuarioResultado[];
}

@Injectable({
  providedIn: 'root'
})
export class ResultadosService {

  constructor(private supabaseService: SupabaseService) {}

  async guardarResultado(resultado: ResultadoJuego): Promise<ResultadoJuego> {
    const { data, error } = await this.supabaseService.client
      .from('resultados_juegos')
      .insert({
        usuario_id: resultado.usuario_id,
        juego: resultado.juego,
        resultado: resultado.resultado,
        puntaje: resultado.puntaje,
        tiempo_segundos: resultado.tiempo_segundos ?? null,
        datos: resultado.datos ?? {}
      })
      .select()
      .single();

    if (error) {
      console.error('Error guardando resultado:', error);
      throw new Error('No se pudo guardar el resultado de la partida.');
    }

    return data;
  }

  async obtenerResultadosPorJuego(juego: string): Promise<ResultadoConUsuario[]> {
    const { data: resultados, error: resultadosError } =
      await this.supabaseService.client
        .from('resultados_juegos')
        .select(`
          id,
          usuario_id,
          juego,
          resultado,
          puntaje,
          tiempo_segundos,
          datos,
          created_at
        `)
        .eq('juego', juego)
        .order('puntaje', { ascending: false })
        .order('tiempo_segundos', { ascending: true })
        .order('created_at', { ascending: false });

    if (resultadosError) {
      console.error(`Error obteniendo resultados de ${juego}:`, resultadosError);
      throw new Error(`No se pudieron obtener los resultados de ${juego}.`);
    }

    const resultadosBase = resultados ?? [];

    if (resultadosBase.length === 0) {
      return [];
    }

    const usuariosIds = Array.from(
      new Set(resultadosBase.map((resultado) => resultado.usuario_id))
    );

    const { data: usuarios, error: usuariosError } =
      await this.supabaseService.client
        .from('usuarios')
        .select('id, nombre, apellido, email')
        .in('id', usuariosIds);

    if (usuariosError) {
      console.warn('No se pudieron obtener los usuarios de los resultados:', usuariosError);

      return resultadosBase.map((resultado) => ({
        ...resultado,
        usuarios: []
      }));
    }

    return resultadosBase.map((resultado) => {
      const usuario = usuarios?.find((item) => item.id === resultado.usuario_id);

      return {
        ...resultado,
        usuarios: usuario
          ? [
              {
                nombre: usuario.nombre,
                apellido: usuario.apellido,
                email: usuario.email
              }
            ]
          : []
      };
    });
  }

  async obtenerResultadosAhorcado(): Promise<ResultadoConUsuario[]> {
    return this.obtenerResultadosPorJuego('ahorcado');
  }

  async obtenerResultadosMayorMenor(): Promise<ResultadoConUsuario[]> {
    return this.obtenerResultadosPorJuego('mayor-menor');
  }

  async obtenerResultadosPreguntados(): Promise<ResultadoConUsuario[]> {
    return this.obtenerResultadosPorJuego('preguntados');
  }

  async obtenerResultadosSpaceShot(): Promise<ResultadoConUsuario[]> {
    return this.obtenerResultadosPorJuego('space-shot');
  }
}