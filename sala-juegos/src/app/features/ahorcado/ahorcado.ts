import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { GameResultsService } from '../../core/services/game-results.service';

@Component({
  selector: 'app-ahorcado',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './ahorcado.html',
  styleUrl: './ahorcado.scss'
})
export class Ahorcado implements OnInit {

  palabras = ['ANGULAR', 'SUPABASE', 'PROGRAMACION', 'COMPONENTE', 'VARIABLE'];
  palabra = '';
  letras = 'ABCDEFGHIJKLMNÑOPQRSTUVWXYZ'.split('');
  letrasSeleccionadas: string[] = [];
  intentosRestantes = 6;
  inicio = 0;
  juegoTerminado = false;
  resultadoMensaje = '';
  resultadoGuardado = false;

  constructor(private gameResultsService: GameResultsService) {}

  ngOnInit() {
    this.nuevoJuego();
  }

  nuevoJuego() {
    this.palabra = this.palabras[Math.floor(Math.random() * this.palabras.length)];
    this.letrasSeleccionadas = [];
    this.intentosRestantes = 6;
    this.inicio = Date.now();
    this.juegoTerminado = false;
    this.resultadoMensaje = '';
    this.resultadoGuardado = false;
  }

  seleccionarLetra(letra: string) {
    if (this.juegoTerminado || this.letrasSeleccionadas.includes(letra)) {
      return;
    }

    this.letrasSeleccionadas.push(letra);

    if (!this.palabra.includes(letra)) {
      this.intentosRestantes--;
    }

    this.verificarEstado();
  }

  get palabraMostrada(): string[] {
    return this.palabra
      .split('')
      .map(letra => this.letrasSeleccionadas.includes(letra) ? letra : '_');
  }

  get gano(): boolean {
    return this.palabra
      .split('')
      .every(letra => this.letrasSeleccionadas.includes(letra));
  }

  get perdio(): boolean {
    return this.intentosRestantes <= 0;
  }

  letraUsada(letra: string): boolean {
    return this.letrasSeleccionadas.includes(letra);
  }

  async verificarEstado() {
    if (this.gano) {
      this.juegoTerminado = true;
      this.resultadoMensaje = '¡Ganaste!';
      await this.guardarResultado('victoria');
      return;
    }

    if (this.perdio) {
      this.juegoTerminado = true;
      this.resultadoMensaje = `Perdiste. La palabra era ${this.palabra}`;
      await this.guardarResultado('derrota');
    }
  }

  async guardarResultado(resultado: 'victoria' | 'derrota') {
    if (this.resultadoGuardado) {
      return;
    }

    this.resultadoGuardado = true;

    const tiempoSegundos = Math.floor((Date.now() - this.inicio) / 1000);
    const puntaje = resultado === 'victoria'
      ? Math.max(100 - this.letrasSeleccionadas.length * 5, 10)
      : 0;

    try {
      await this.gameResultsService.saveResult({
        juego: 'ahorcado',
        resultado,
        puntaje,
        tiempo_segundos: tiempoSegundos,
        datos: {
          palabra: this.palabra,
          letras_seleccionadas: this.letrasSeleccionadas.length,
          intentos_restantes: this.intentosRestantes
        }
      });
    } catch (error) {
      console.error(error);
    }
  }
}
