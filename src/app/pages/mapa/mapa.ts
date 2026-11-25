import { Component, computed, inject, signal } from '@angular/core';
import { Icon } from '../../icon/icon';
import { CLASE_ESTADO, COLOR_ESTADO, EstadoReporte, estiloCategoria } from '../../datos-demo';
import { ReportesService } from '../../reportes.service';

@Component({
  selector: 'app-mapa',
  imports: [Icon],
  templateUrl: './mapa.html',
  styleUrl: './mapa.css',
})
export class Mapa {
  protected readonly reportes = inject(ReportesService).misReportes;
  protected readonly claseEstado = CLASE_ESTADO;
  protected readonly colorEstado = COLOR_ESTADO;
  protected readonly estiloCategoria = estiloCategoria;
  protected readonly estados = Object.keys(COLOR_ESTADO) as EstadoReporte[];

  protected readonly seleccionado = signal<string | null>(null);
  // Si no se eligió ninguno, se muestra el más reciente.
  protected readonly reporteSeleccionado = computed(
    () => this.reportes().find((r) => r.id === this.seleccionado()) ?? this.reportes()[0] ?? null,
  );
}
