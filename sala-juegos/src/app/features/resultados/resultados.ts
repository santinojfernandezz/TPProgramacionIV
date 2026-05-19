import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import {
  ResultadoConUsuario,
  ResultadosService
} from '../../core/services/resultados.service';

interface TablaResultados {
  titulo: string;
  descripcion: string;
  icono: string;
  juego: string;
  resultados: ResultadoConUsuario[];
}

@Component({
  selector: 'app-resultados',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './resultados.html',
  styleUrls: ['./resultados.scss']
})
export class Resultados implements OnInit {
  cargando = true;
  mensaje = '';
  tipoMensaje: 'success' | 'danger' | 'warning' | 'info' = 'info';

  tablas: TablaResultados[] = [
    {
      titulo: 'Ahorcado',
      descripcion: 'Resultados del juego Ahorcado ordenados por mejor desempeño.',
      icono: '🎯',
      juego: 'ahorcado',
      resultados: []
    },
    {
      titulo: 'Mayor o Menor',
      descripcion: 'Resultados del juego de cartas ordenados por puntaje.',
      icono: '🃏',
      juego: 'mayor-menor',
      resultados: []
    },
    {
      titulo: 'Preguntados',
      descripcion: 'Resultados de preguntas de geografía obtenidas desde una API externa.',
      icono: '❓',
      juego: 'preguntados',
      resultados: []
    },
    {
      titulo: 'Space Shot',
      descripcion: 'Resultados del juego propio de reflejos y precisión.',
      icono: '🚀',
      juego: 'space-shot',
      resultados: []
    }
  ];

  constructor(
    private resultadosService: ResultadosService,
    private cdr: ChangeDetectorRef
  ) {}

  async ngOnInit(): Promise<void> {
    await this.cargarResultados();
  }

  async cargarResultados(): Promise<void> {
    this.cargando = true;
    this.mensaje = '';
    this.tipoMensaje = 'info';
    this.cdr.detectChanges();

    try {

      const ahorcado = await this.ejecutarConTimeout(
        this.resultadosService.obtenerResultadosAhorcado(),
        []
      );

      const mayorMenor = await this.ejecutarConTimeout(
        this.resultadosService.obtenerResultadosMayorMenor(),
        []
      );

      const preguntados = await this.ejecutarConTimeout(
        this.resultadosService.obtenerResultadosPreguntados(),
        []
      );

      const spaceShot = await this.ejecutarConTimeout(
        this.resultadosService.obtenerResultadosSpaceShot(),
        []
      );

      this.tablas = [
        {
          ...this.tablas[0],
          resultados: ahorcado
        },
        {
          ...this.tablas[1],
          resultados: mayorMenor
        },
        {
          ...this.tablas[2],
          resultados: preguntados
        },
        {
          ...this.tablas[3],
          resultados: spaceShot
        }
      ];

      
      this.tipoMensaje = 'success';
    } catch (error) {
      console.error('Error cargando resultados:', error);
      this.mensaje = 'No se pudieron cargar todos los resultados.';
      this.tipoMensaje = 'danger';
    } finally {
      this.cargando = false;
      this.cdr.detectChanges();
    }
  }

  private async ejecutarConTimeout<T>(
    promesa: Promise<T>,
    valorPorDefecto: T,
    tiempoMaximo = 8000
  ): Promise<T> {
    try {
      return await Promise.race([
        promesa,
        new Promise<T>((resolve) => {
          window.setTimeout(() => resolve(valorPorDefecto), tiempoMaximo);
        })
      ]);
    } catch (error) {
      console.warn('Una tabla no pudo cargarse:', error);
      return valorPorDefecto;
    }
  }

  obtenerNombreJugador(resultado: ResultadoConUsuario): string {
    const usuario = resultado.usuarios?.[0];

    if (usuario?.nombre) {
      return `${usuario.nombre} ${usuario.apellido || ''}`.trim();
    }

    if (usuario?.email) {
      return usuario.email;
    }

    return 'Usuario';
  }

  obtenerAciertos(resultado: ResultadoConUsuario): string {
    const aciertos = resultado.datos?.aciertos;

    if (aciertos === undefined || aciertos === null) {
      return '-';
    }

    return String(aciertos);
  }

  obtenerErrores(resultado: ResultadoConUsuario): string {
    const errores = resultado.datos?.errores;

    if (errores === undefined || errores === null) {
      return '-';
    }

    return String(errores);
  }

  obtenerDetalle(resultado: ResultadoConUsuario): string {
    if (!resultado.datos) {
      return '-';
    }

    if (resultado.juego === 'ahorcado') {
      const letras = resultado.datos.letrasSeleccionadas ?? resultado.datos.letras_seleccionadas;
      const palabra = resultado.datos.palabra;

      if (palabra || letras) {
        return `Palabra: ${palabra || '-'} · Letras: ${letras || '-'}`;
      }
    }

    if (resultado.juego === 'mayor-menor') {
      const cartas = resultado.datos.cartasJugadas ?? resultado.datos.cartas_jugadas;

      if (cartas) {
        return `Cartas jugadas: ${cartas}`;
      }
    }

    if (resultado.juego === 'preguntados') {
      const total = resultado.datos.totalPreguntas;
      const porcentaje = resultado.datos.porcentajeAcierto;

      if (total || porcentaje !== undefined) {
        return `Total: ${total || '-'} · Acierto: ${porcentaje ?? '-'}%`;
      }
    }

    if (resultado.juego === 'space-shot') {
      const objetos = resultado.datos.objetosTocados;
      const tiempoRestante = resultado.datos.tiempoRestante;

      if (objetos !== undefined || tiempoRestante !== undefined) {
        return `Objetos tocados: ${objetos ?? '-'} · Restante: ${tiempoRestante ?? '-'}s`;
      }
    }

    return '-';
  }

  formatearTiempo(segundos?: number | null): string {
    if (segundos === undefined || segundos === null) {
      return '-';
    }

    const minutos = Math.floor(segundos / 60);
    const segundosRestantes = segundos % 60;

    const min = minutos.toString().padStart(2, '0');
    const seg = segundosRestantes.toString().padStart(2, '0');

    return `${min}:${seg}`;
  }

  formatearFecha(fecha?: string): string {
    if (!fecha) {
      return '-';
    }

    return new Date(fecha).toLocaleString('es-AR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }
}