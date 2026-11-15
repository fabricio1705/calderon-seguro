import { Component, computed, signal } from '@angular/core';
import { Icon } from '../../icon/icon';
import { CLASE_ESTADO, COLOR_ESTADO, EstadoReporte, REPORTES_DEMO, estiloCategoria } from '../../datos-demo';

@Component({
  selector: 'app-mapa',
  imports: [Icon],
  templateUrl: './mapa.html',
  styleUrl: './mapa.css',
})
export class Mapa {
  protected readonly reportes = REPORTES_DEMO;
  protected readonly claseEstado = CLASE_ESTADO;
  protected readonly colorEstado = COLOR_ESTADO;
  protected readonly estiloCategoria = estiloCategoria;
  protected readonly estados = Object.keys(COLOR_ESTADO) as EstadoReporte[];

  protected readonly seleccionado = signal<string | null>(REPORTES_DEMO[0]?.codigo ?? null);
  protected readonly reporteSeleccionado = computed(
    () => this.reportes.find((r) => r.codigo === this.seleccionado()) ?? null,
  );
}
