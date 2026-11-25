import { Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Icon } from '../../icon/icon';
import { CLASE_ESTADO, estiloCategoria } from '../../datos-demo';
import { ReportesService } from '../../reportes.service';
import { SesionService } from '../../sesion.service';

@Component({
  selector: 'app-inicio',
  imports: [RouterLink, Icon],
  templateUrl: './inicio.html',
  styleUrl: './inicio.css',
})
export class Inicio {
  protected readonly sesion = inject(SesionService);
  protected readonly estiloCategoria = estiloCategoria;

  private readonly reportes = inject(ReportesService);

  // Cifras calculadas con los reportes creados en esta sesión (inician en cero).
  protected readonly resumen = computed(() => {
    const total = this.reportes.total();
    const detalle = total === 0 ? 'Sin registros aún' : 'En esta sesión';
    return [
      { titulo: 'Reportes registrados', valor: total, icono: 'file-text', color: 'azul', detalle },
      { titulo: 'Reportes pendientes', valor: this.reportes.pendientes(), icono: 'clock', color: 'ambar', detalle },
      { titulo: 'Reportes atendidos', valor: this.reportes.atendidos(), icono: 'check-circle', color: 'verde', detalle },
      { titulo: 'Incidentes recientes', valor: this.reportes.ultimosSieteDias(), icono: 'activity', color: 'rojo', detalle: 'Últimos 7 días' },
    ];
  });

  protected readonly accesos = [
    { ruta: '/reportar', titulo: 'Reportar incidente', texto: 'Informa lo que sucede en tu comunidad.', icono: 'megaphone' },
    { ruta: '/mis-reportes', titulo: 'Mis reportes', texto: 'Consulta el estado de tus reportes.', icono: 'file-text' },
    { ruta: '/mapa', titulo: 'Mapa', texto: 'Mira los incidentes en el mapa.', icono: 'map' },
    { ruta: '/perfil', titulo: 'Mi perfil', texto: 'Revisa tu información personal.', icono: 'user' },
  ];

  protected readonly recientes = computed(() => this.reportes.misReportes().slice(0, 4));
  protected readonly claseEstado = CLASE_ESTADO;
}
