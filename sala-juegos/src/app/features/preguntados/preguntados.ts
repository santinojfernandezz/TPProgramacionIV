import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { ResultadosService } from '../../core/services/resultados.service';

interface RestCountry {
  name: {
    common: string;
    official: string;
  };
  translations?: {
    spa?: {
      common: string;
      official: string;
    };
  };
  capital?: string[];
  region: string;
  flags?: {
    png?: string;
    svg?: string;
    alt?: string;
  };
}

interface Pregunta {
  categoria: string;
  dificultad: string;
  pregunta: string;
  respuestaCorrecta: string;
  opciones: string[];
}

@Component({
  selector: 'app-preguntados',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './preguntados.html',
  styleUrls: ['./preguntados.scss']
})
export class Preguntados implements OnInit, OnDestroy {
  preguntas: Pregunta[] = [];
  preguntaActualIndex = 0;

  aciertos = 0;
  errores = 0;
  puntaje = 0;
  tiempoSegundos = 0;

  cargando = true;
  partidaFinalizada = false;
  resultadoGuardado = false;

  mensaje = '';
  tipoMensaje: 'success' | 'danger' | 'warning' | 'info' = 'info';

  respuestaSeleccionada: string | null = null;
  mostrandoRespuesta = false;

  private timerId: number | null = null;

  constructor(
    private authService: AuthService,
    private resultadosService: ResultadosService,
    private cdr: ChangeDetectorRef
  ) {}

  async ngOnInit(): Promise<void> {
    await this.iniciarPartida();
  }

  ngOnDestroy(): void {
    this.detenerTimer();
  }

  get preguntaActual(): Pregunta | null {
    return this.preguntas[this.preguntaActualIndex] ?? null;
  }

  get totalPreguntas(): number {
    return this.preguntas.length;
  }

  get progreso(): number {
    if (this.totalPreguntas === 0) {
      return 0;
    }

    return Math.round(((this.preguntaActualIndex + 1) / this.totalPreguntas) * 100);
  }

  async iniciarPartida(): Promise<void> {
    this.cargando = true;
    this.partidaFinalizada = false;
    this.resultadoGuardado = false;

    this.preguntas = [];
    this.preguntaActualIndex = 0;
    this.aciertos = 0;
    this.errores = 0;
    this.puntaje = 0;
    this.tiempoSegundos = 0;

    this.respuestaSeleccionada = null;
    this.mostrandoRespuesta = false;

    this.mensaje = '';
    this.tipoMensaje = 'info';

    this.detenerTimer();
    this.cdr.detectChanges();

    try {
      await this.cargarPreguntas();

      if (this.preguntas.length === 0) {
        throw new Error('No se recibieron preguntas desde la API.');
      }

      this.iniciarTimer();
    } catch (error) {
      console.error('Error cargando Preguntados:', error);
      this.mensaje = 'No se pudieron cargar las preguntas. Intentá nuevamente en unos segundos.';
      this.tipoMensaje = 'danger';
    } finally {
      this.cargando = false;
      this.cdr.detectChanges();
    }
  }

  async cargarPreguntas(): Promise<void> {
    const url = 'https://restcountries.com/v3.1/all?fields=name,capital,region,flags,translations';

    const controller = new AbortController();

    const timeoutId = window.setTimeout(() => {
      controller.abort();
    }, 10000);

    try {
      const response = await fetch(url, {
        method: 'GET',
        signal: controller.signal,
        cache: 'no-store'
      });

      if (!response.ok) {
        throw new Error('La API de países no respondió correctamente.');
      }

      const data: RestCountry[] = await response.json();

      if (!Array.isArray(data) || data.length === 0) {
        throw new Error('La API no devolvió países.');
      }

      const paisesValidos = data
        .filter((pais) => pais.capital && pais.capital.length > 0 && pais.name?.common)
        .map((pais) => ({
          nombre: this.obtenerNombrePais(pais),
          capital: pais.capital![0],
          region: this.traducirRegion(pais.region)
        }))
        .filter((pais) => pais.nombre && pais.capital && pais.region);

      if (paisesValidos.length < 10) {
        throw new Error('No hay suficientes datos para generar preguntas.');
      }

      const paisesMezclados = this.mezclarArray(paisesValidos);
      const preguntasGeneradas: Pregunta[] = [];

      for (let i = 0; i < paisesMezclados.length && preguntasGeneradas.length < 10; i++) {
        const pais = paisesMezclados[i];

        const tipoPregunta = preguntasGeneradas.length % 3;

        if (tipoPregunta === 0) {
          preguntasGeneradas.push(
            this.crearPreguntaCapital(pais, paisesValidos)
          );
        } else if (tipoPregunta === 1) {
          preguntasGeneradas.push(
            this.crearPreguntaPaisPorCapital(pais, paisesValidos)
          );
        } else {
          preguntasGeneradas.push(
            this.crearPreguntaRegion(pais)
          );
        }
      }

      this.preguntas = preguntasGeneradas;
    } catch (error: any) {
      if (error?.name === 'AbortError') {
        throw new Error('La API tardó demasiado en responder.');
      }

      throw error;
    } finally {
      clearTimeout(timeoutId);
    }
  }

  crearPreguntaCapital(
    pais: { nombre: string; capital: string; region: string },
    paises: { nombre: string; capital: string; region: string }[]
  ): Pregunta {
    const opcionesIncorrectas = this.obtenerOpcionesAleatorias(
      paises
        .filter((item) => item.capital !== pais.capital)
        .map((item) => item.capital),
      3
    );

    return {
      categoria: 'Geografía',
      dificultad: 'Media',
      pregunta: `¿Cuál es la capital de ${pais.nombre}?`,
      respuestaCorrecta: pais.capital,
      opciones: this.mezclarArray([
        pais.capital,
        ...opcionesIncorrectas
      ])
    };
  }

  crearPreguntaPaisPorCapital(
    pais: { nombre: string; capital: string; region: string },
    paises: { nombre: string; capital: string; region: string }[]
  ): Pregunta {
    const opcionesIncorrectas = this.obtenerOpcionesAleatorias(
      paises
        .filter((item) => item.nombre !== pais.nombre)
        .map((item) => item.nombre),
      3
    );

    return {
      categoria: 'Geografía',
      dificultad: 'Media',
      pregunta: `¿Qué país tiene como capital a ${pais.capital}?`,
      respuestaCorrecta: pais.nombre,
      opciones: this.mezclarArray([
        pais.nombre,
        ...opcionesIncorrectas
      ])
    };
  }

  crearPreguntaRegion(
    pais: { nombre: string; capital: string; region: string }
  ): Pregunta {
    const regiones = [
      'África',
      'América',
      'Asia',
      'Europa',
      'Oceanía',
      'Antártida'
    ];

    const opcionesIncorrectas = this.obtenerOpcionesAleatorias(
      regiones.filter((region) => region !== pais.region),
      3
    );

    return {
      categoria: 'Geografía',
      dificultad: 'Fácil',
      pregunta: `¿En qué región se encuentra ${pais.nombre}?`,
      respuestaCorrecta: pais.region,
      opciones: this.mezclarArray([
        pais.region,
        ...opcionesIncorrectas
      ])
    };
  }

  seleccionarRespuesta(opcion: string): void {
    if (this.partidaFinalizada || this.mostrandoRespuesta || !this.preguntaActual) {
      return;
    }

    this.respuestaSeleccionada = opcion;
    this.mostrandoRespuesta = true;

    const esCorrecta = opcion === this.preguntaActual.respuestaCorrecta;

    if (esCorrecta) {
      this.aciertos++;
      this.puntaje += 10;
      this.mensaje = '¡Correcto! Sumaste 10 puntos.';
      this.tipoMensaje = 'success';
    } else {
      this.errores++;
      this.mensaje = `Incorrecto. La respuesta correcta era: ${this.preguntaActual.respuestaCorrecta}`;
      this.tipoMensaje = 'danger';
    }

    this.cdr.detectChanges();

    window.setTimeout(() => {
      this.avanzarPregunta();
    }, 1300);
  }

  avanzarPregunta(): void {
    this.respuestaSeleccionada = null;
    this.mostrandoRespuesta = false;
    this.mensaje = '';

    const esUltimaPregunta = this.preguntaActualIndex >= this.totalPreguntas - 1;

    if (esUltimaPregunta) {
      this.finalizarPartida();
      return;
    }

    this.preguntaActualIndex++;
    this.cdr.detectChanges();
  }

  async finalizarPartida(): Promise<void> {
    this.partidaFinalizada = true;
    this.detenerTimer();

    if (this.resultadoGuardado) {
      return;
    }

    try {
      const user = await this.authService.getCurrentUser();

      if (!user) {
        this.mensaje = 'No se pudo identificar al usuario para guardar el resultado.';
        this.tipoMensaje = 'warning';
        this.cdr.detectChanges();
        return;
      }

      await this.resultadosService.guardarResultado({
        usuario_id: user.id,
        juego: 'preguntados',
        resultado: this.aciertos >= this.errores ? 'buen desempeño' : 'a mejorar',
        puntaje: this.puntaje,
        tiempo_segundos: this.tiempoSegundos,
        datos: {
          aciertos: this.aciertos,
          errores: this.errores,
          totalPreguntas: this.totalPreguntas,
          porcentajeAcierto: this.totalPreguntas > 0
            ? Math.round((this.aciertos / this.totalPreguntas) * 100)
            : 0,
          api: 'REST Countries',
          tematica: 'Geografía'
        }
      });

      this.resultadoGuardado = true;
      this.mensaje = 'Partida finalizada. Tu resultado fue guardado correctamente.';
      this.tipoMensaje = 'success';
    } catch (error) {
      console.error('Error guardando resultado de Preguntados:', error);
      this.mensaje = 'La partida terminó, pero no se pudo guardar el resultado.';
      this.tipoMensaje = 'danger';
    } finally {
      this.cdr.detectChanges();
    }
  }

  iniciarTimer(): void {
    this.timerId = window.setInterval(() => {
      if (!this.partidaFinalizada) {
        this.tiempoSegundos++;
        this.cdr.detectChanges();
      }
    }, 1000);
  }

  detenerTimer(): void {
    if (this.timerId !== null) {
      clearInterval(this.timerId);
      this.timerId = null;
    }
  }

  obtenerClaseOpcion(opcion: string): string {
    if (!this.mostrandoRespuesta || !this.preguntaActual) {
      return 'btn-outline-light';
    }

    if (opcion === this.preguntaActual.respuestaCorrecta) {
      return 'btn-success';
    }

    if (opcion === this.respuestaSeleccionada) {
      return 'btn-danger';
    }

    return 'btn-outline-light opcion-desactivada';
  }

  formatearTiempo(segundos: number): string {
    const minutos = Math.floor(segundos / 60);
    const segundosRestantes = segundos % 60;

    const min = minutos.toString().padStart(2, '0');
    const seg = segundosRestantes.toString().padStart(2, '0');

    return `${min}:${seg}`;
  }

  private obtenerNombrePais(pais: RestCountry): string {
    return pais.translations?.spa?.common || pais.name.common;
  }

  private traducirRegion(region: string): string {
    const regiones: Record<string, string> = {
      Africa: 'África',
      Americas: 'América',
      Asia: 'Asia',
      Europe: 'Europa',
      Oceania: 'Oceanía',
      Antarctic: 'Antártida'
    };

    return regiones[region] || region;
  }

  private obtenerOpcionesAleatorias(opciones: string[], cantidad: number): string[] {
    const opcionesUnicas = Array.from(new Set(opciones));

    return this.mezclarArray(opcionesUnicas).slice(0, cantidad);
  }

  private mezclarArray<T>(array: T[]): T[] {
    return [...array].sort(() => Math.random() - 0.5);
  }
}