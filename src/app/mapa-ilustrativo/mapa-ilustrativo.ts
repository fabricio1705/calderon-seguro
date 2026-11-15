import { Component, ElementRef, computed, input, output, signal, viewChild } from '@angular/core';
import { Icon } from '../icon/icon';

export interface Punto {
  x: number;
  y: number;
}

export interface MarcadorMapa extends Punto {
  id: string;
  color: string;
}

// Tamaño del dibujo SVG. Las coordenadas de los marcadores usan esta escala.
const ANCHO = 800;
const ALTO = 520;

// Genera una cuadrícula de manzanas para dibujar una zona urbana.
function manzanas(x0: number, y0: number, columnas: number, filas: number, paso: number, tamano: number) {
  const lista: { x: number; y: number; w: number; h: number }[] = [];
  for (let c = 0; c < columnas; c++) {
    for (let f = 0; f < filas; f++) {
      lista.push({ x: x0 + c * paso, y: y0 + f * paso, w: tamano, h: tamano * 0.85 });
    }
  }
  return lista;
}

@Component({
  selector: 'app-mapa-ilustrativo',
  imports: [Icon],
  templateUrl: './mapa-ilustrativo.html',
  styleUrl: './mapa-ilustrativo.css',
})
export class MapaIlustrativo {
  // Marcadores de ejemplo (por ejemplo, reportes ficticios).
  readonly marcadores = input<MarcadorMapa[]>([]);
  readonly seleccionado = input<string | null>(null);
  // Punto azul de "ubicación del incidente" (pantalla Reportar).
  readonly punto = input<Punto | null>(null);
  // Si es true, al hacer clic en el mapa se mueve el punto.
  readonly permitirMarcar = input(false);

  readonly marcadorClic = output<string>();
  readonly puntoCambiado = output<Punto>();
  readonly ubicar = output<void>();

  private readonly svg = viewChild.required<ElementRef<SVGSVGElement>>('svg');

  protected readonly manzanasCalderon = manzanas(352, 178, 6, 7, 36, 30);
  protected readonly manzanasPortoviejo = manzanas(18, 252, 7, 7, 25, 20);

  private readonly nivelesZoom = [1, 1.5, 2, 3];
  protected readonly nivel = signal(0);
  protected readonly zoom = computed(() => this.nivelesZoom[this.nivel()]);
  protected readonly escalaMarcador = computed(() => 1 / this.zoom());

  // Área visible del dibujo según el zoom (centrada en el punto o en la parroquia).
  protected readonly viewBox = computed(() => {
    const w = ANCHO / this.zoom();
    const h = ALTO / this.zoom();
    const centro = this.punto() ?? { x: 450, y: 290 };
    const x = Math.min(Math.max(centro.x - w / 2, 0), ANCHO - w);
    const y = Math.min(Math.max(centro.y - h / 2, 0), ALTO - h);
    return `${x} ${y} ${w} ${h}`;
  });

  acercar(): void {
    this.nivel.update((n) => Math.min(n + 1, this.nivelesZoom.length - 1));
  }

  alejar(): void {
    this.nivel.update((n) => Math.max(n - 1, 0));
  }

  alHacerClic(evento: MouseEvent): void {
    if (!this.permitirMarcar()) return;
    const svg = this.svg().nativeElement;
    const matriz = svg.getScreenCTM();
    if (!matriz) return;
    const p = new DOMPoint(evento.clientX, evento.clientY).matrixTransform(matriz.inverse());
    this.puntoCambiado.emit({ x: Math.round(p.x), y: Math.round(p.y) });
  }

  seleccionarMarcador(evento: Event, id: string): void {
    evento.stopPropagation();
    this.marcadorClic.emit(id);
  }

  transformarMarcador(m: Punto, seleccionado = false): string {
    const escala = this.escalaMarcador() * (seleccionado ? 1.3 : 1);
    return `translate(${m.x} ${m.y}) scale(${escala})`;
  }
}
