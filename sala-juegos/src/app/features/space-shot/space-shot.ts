import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnDestroy } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { ResultadosService } from '../../core/services/resultados.service';

type TipoObjeto = 'meteorito' | 'planeta' | 'nave';

interface ObjetoEspacial {
  id: number;
  tipo: TipoObjeto;
  emoji: string;
  x: number;
  y: number;
  velocidad: number;
}

@Component({
  selector: 'app-space-shot',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './space-shot.html',
  styleUrls: ['./space-shot.scss']
})
export class SpaceShot implements OnDestroy {
  objetos: ObjetoEspacial[] = [];

  puntaje = 0;
  aciertos = 0;
  errores = 0;
  tiempoRestante = 30;
  tiempoTotal = 30;
  maxErrores = 5;

  partidaIniciada = false;
  partidaFinalizada = false;
  resultadoGuardado = false;

  mensaje = 'Tocá solo los meteoritos. No toques planetas ni naves.';
  tipoMensaje: 'success' | 'danger' | 'warning' | 'info' = 'info';

  private siguienteId = 1;
  private timerPartida: number | null = null;
  private timerSpawn: number | null = null;
  private timerMovimiento: number | null = null;

  constructor(
    private authService: AuthService,
    private resultadosService: ResultadosService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnDestroy(): void {
    this.detenerTimers();
  }

  iniciarPartida(): void {
    this.objetos = [];
    this.puntaje = 0;
    this.aciertos = 0;
    this.errores = 0;
    this.tiempoRestante = this.tiempoTotal;
    this.siguienteId = 1;

    this.partidaIniciada = true;
    this.partidaFinalizada = false;
    this.resultadoGuardado = false;

    this.mensaje = '¡Partida iniciada! Tocá solo los meteoritos.';
    this.tipoMensaje = 'info';

    this.detenerTimers();

    this.timerPartida = window.setInterval(() => {
      this.tiempoRestante--;

      if (this.tiempoRestante <= 0) {
        this.finalizarPartida('tiempo finalizado');
      }

      this.cdr.detectChanges();
    }, 1000);

    this.timerSpawn = window.setInterval(() => {
      this.crearObjeto();
      this.cdr.detectChanges();
    }, 800);

    this.timerMovimiento = window.setInterval(() => {
      this.moverObjetos();
      this.cdr.detectChanges();
    }, 160);
  }

  crearObjeto(): void {
    if (!this.partidaIniciada || this.partidaFinalizada) {
      return;
    }

    const tipos: TipoObjeto[] = ['meteorito', 'planeta', 'nave'];
    const tipo = tipos[Math.floor(Math.random() * tipos.length)];

    const objeto: ObjetoEspacial = {
      id: this.siguienteId++,
      tipo,
      emoji: this.obtenerEmoji(tipo),
      x: Math.floor(Math.random() * 85) + 5,
      y: -8,
      velocidad: this.obtenerVelocidad(tipo)
    };

    this.objetos = [...this.objetos, objeto];
  }

  moverObjetos(): void {
    if (!this.partidaIniciada || this.partidaFinalizada) {
      return;
    }

    const objetosActualizados: ObjetoEspacial[] = [];

    for (const objeto of this.objetos) {
      const nuevoObjeto = {
        ...objeto,
        y: objeto.y + objeto.velocidad
      };

      if (nuevoObjeto.y >= 105) {
        if (nuevoObjeto.tipo === 'meteorito') {
          this.errores++;
          this.mensaje = 'Un meteorito chocó. Sumaste un error.';
          this.tipoMensaje = 'warning';

          if (this.errores >= this.maxErrores) {
            this.finalizarPartida('derrota');
            return;
          }
        }

        continue;
      }

      objetosActualizados.push(nuevoObjeto);
    }

    this.objetos = objetosActualizados;
  }

  tocarObjeto(event: PointerEvent, objeto: ObjetoEspacial): void {
    event.preventDefault();
    event.stopPropagation();

    if (!this.partidaIniciada || this.partidaFinalizada) {
      return;
    }

    const existeObjeto = this.objetos.some((item) => item.id === objeto.id);

    if (!existeObjeto) {
      return;
    }

    this.objetos = this.objetos.filter((item) => item.id !== objeto.id);

    if (objeto.tipo === 'meteorito') {
      this.aciertos++;
      this.puntaje += 10;
      this.mensaje = '¡Bien! Destruiste un meteorito peligroso. +10 puntos.';
      this.tipoMensaje = 'success';
    } else {
      this.errores++;
      this.puntaje = Math.max(0, this.puntaje - 5);
      this.mensaje = 'Ese objeto no era un meteorito. -5 puntos.';
      this.tipoMensaje = 'danger';

      if (this.errores >= this.maxErrores) {
        this.finalizarPartida('derrota');
        return;
      }
    }

    this.cdr.detectChanges();
  }

  async finalizarPartida(resultado: string): Promise<void> {
    if (this.partidaFinalizada) {
      return;
    }

    this.partidaFinalizada = true;
    this.partidaIniciada = false;
    this.detenerTimers();

    if (resultado === 'tiempo finalizado') {
      this.mensaje = 'Partida finalizada. Se terminó el tiempo.';
      this.tipoMensaje = 'success';
    } else {
      this.mensaje = 'Partida finalizada. Llegaste al límite de errores.';
      this.tipoMensaje = 'warning';
    }

    await this.guardarResultado(resultado);
    this.cdr.detectChanges();
  }

  async guardarResultado(resultado: string): Promise<void> {
    if (this.resultadoGuardado) {
      return;
    }

    try {
      const user = await this.authService.getCurrentUser();

      if (!user) {
        this.mensaje = 'No se pudo identificar al usuario para guardar el resultado.';
        this.tipoMensaje = 'warning';
        return;
      }

      await this.resultadosService.guardarResultado({
        usuario_id: user.id,
        juego: 'space-shot',
        resultado,
        puntaje: this.puntaje,
        tiempo_segundos: this.tiempoTotal - this.tiempoRestante,
        datos: {
          aciertos: this.aciertos,
          errores: this.errores,
          tiempoTotal: this.tiempoTotal,
          tiempoRestante: this.tiempoRestante,
          objetosTocados: this.aciertos + this.errores,
          regla: 'Tocar solo meteoritos peligrosos'
        }
      });

      this.resultadoGuardado = true;
      this.mensaje = `${this.mensaje} Resultado guardado correctamente.`;
      this.tipoMensaje = 'success';
    } catch (error) {
      console.error('Error guardando resultado de Space Shot:', error);
      this.mensaje = 'La partida terminó, pero no se pudo guardar el resultado.';
      this.tipoMensaje = 'danger';
    }
  }

  reiniciarPartida(): void {
    this.iniciarPartida();
  }

  detenerTimers(): void {
    if (this.timerPartida !== null) {
      clearInterval(this.timerPartida);
      this.timerPartida = null;
    }

    if (this.timerSpawn !== null) {
      clearInterval(this.timerSpawn);
      this.timerSpawn = null;
    }

    if (this.timerMovimiento !== null) {
      clearInterval(this.timerMovimiento);
      this.timerMovimiento = null;
    }
  }

  obtenerEmoji(tipo: TipoObjeto): string {
    const emojis: Record<TipoObjeto, string> = {
      meteorito: '☄️',
      planeta: '🪐',
      nave: '🚀'
    };

    return emojis[tipo];
  }

  obtenerVelocidad(tipo: TipoObjeto): number {
    if (tipo === 'meteorito') {
      return 2.6;
    }

    if (tipo === 'nave') {
      return 2.2;
    }

    return 1.9;
  }

  obtenerClaseObjeto(tipo: TipoObjeto): string {
    return `objeto-${tipo}`;
  }

  formatearTiempo(segundos: number): string {
    return segundos.toString().padStart(2, '0');
  }
}