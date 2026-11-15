import { Component, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Icon } from '../../icon/icon';
import { CLASE_ESTADO, REPORTES_DEMO, ReporteDemo, estiloCategoria } from '../../datos-demo';

@Component({
  selector: 'app-mis-reportes',
  imports: [RouterLink, Icon],
  templateUrl: './mis-reportes.html',
  styleUrl: './mis-reportes.css',
})
export class MisReportes {
  protected readonly reportes = REPORTES_DEMO;
  protected readonly claseEstado = CLASE_ESTADO;
  protected readonly estiloCategoria = estiloCategoria;

  // Reporte que se muestra en la ventana de detalles (solo lectura).
  protected readonly detalle = signal<ReporteDemo | null>(null);
}
