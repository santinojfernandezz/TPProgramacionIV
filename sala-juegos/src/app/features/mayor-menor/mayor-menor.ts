import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { GameResultsService } from '../../core/services/game-results.service';

interface Carta {
  numero: number;
  palo: string;
}

@Component({
  selector: 'app-mayor-menor',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './mayor-menor.html',
  styleUrl: './mayor-menor.scss'
})
export class MayorMenor implements OnInit {

  palos = ['Oro', 'Copa', 'Espada', 'Basto'];
  cartaActual!: Carta;
  aciertos = 0;
  rondas = 0;
  maxRondas = 10;
  mensaje = '';
  juegoTerminado = false;
  inicio = 0;
  resultadoGuardado = false;

  constructor(private gameResultsService: GameResultsService) {}

  ngOnInit() {
    this.nuevoJuego();
  }

  nuevoJuego() {
    this.cartaActual = this.generarCarta();
    this.aciertos = 0;
    this.rondas = 0;
    this.mensaje = '';
    this.juegoTerminado = false;
    this.inicio = Date.now();
    this.resultadoGuardado = false;
  }

  generarCarta(): Carta {
    return {
      numero: Math.floor(Math.random() * 12) + 1,
      palo: this.palos[Math.floor(Math.random() * this.palos.length)]
    };
  }

  async elegir(opcion: 'mayor' | 'menor') {
    if (this.juegoTerminado) {
      return;
    }

    const nuevaCarta = this.generarCarta();

    if (nuevaCarta.numero === this.cartaActual.numero) {
      this.mensaje = `Salió ${nuevaCarta.numero} de ${nuevaCarta.palo}. Empate, no suma ni resta.`;
    } else {
      const acerto =
        opcion === 'mayor'
          ? nuevaCarta.numero > this.cartaActual.numero
          : nuevaCarta.numero < this.cartaActual.numero;

      if (acerto) {
        this.aciertos++;
        this.mensaje = `Correcto. Salió ${nuevaCarta.numero} de ${nuevaCarta.palo}.`;
      } else {
        this.mensaje = `Incorrecto. Salió ${nuevaCarta.numero} de ${nuevaCarta.palo}.`;
      }
    }

    this.cartaActual = nuevaCarta;
    this.rondas++;

    if (this.rondas >= this.maxRondas) {
      this.juegoTerminado = true;
      await this.guardarResultado();
    }
  }

  async guardarResultado() {
    if (this.resultadoGuardado) {
      return;
    }

    this.resultadoGuardado = true;

    const tiempoSegundos = Math.floor((Date.now() - this.inicio) / 1000);
    const resultado = this.aciertos >= 5 ? 'victoria' : 'derrota';

    try {
      await this.gameResultsService.saveResult({
        juego: 'mayor-menor',
        resultado,
        puntaje: this.aciertos * 10,
        tiempo_segundos: tiempoSegundos,
        datos: {
          aciertos: this.aciertos,
          rondas: this.rondas,
          total_rondas: this.maxRondas
        }
      });
    } catch (error) {
      console.error(error);
    }
  }
}