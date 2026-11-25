import { Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Icon } from '../../icon/icon';
import { CLASE_ESTADO, ReporteDemo, estiloCategoria } from '../../datos-demo';
import { ReportesService } from '../../reportes.service';

@Component({
  selector: 'app-mis-reportes',
  imports: [RouterLink, Icon],
  templateUrl: './mis-reportes.html',
  styleUrl: './mis-reportes.css',
})
export class MisReportes {
  // Reportes creados en esta sesión (más reciente primero), guardados solo en memoria.
  protected readonly reportes = inject(ReportesService).misReportes;
  protected readonly claseEstado = CLASE_ESTADO;
  protected readonly estiloCategoria = estiloCategoria;

  // Reporte que se muestra en la ventana de detalles (solo lectura).
  protected readonly detalle = signal<ReporteDemo | null>(null);
}
