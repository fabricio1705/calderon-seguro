import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Icon } from '../../icon/icon';
import { CLASE_ESTADO, REPORTES_DEMO, estiloCategoria } from '../../datos-demo';
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

  // Aún no hay reportes registrados: todas las cifras inician en cero.
  protected readonly resumen = [
    { titulo: 'Reportes registrados', valor: 0, icono: 'file-text', color: 'azul' },
    { titulo: 'Reportes pendientes', valor: 0, icono: 'clock', color: 'ambar' },
    { titulo: 'Reportes atendidos', valor: 0, icono: 'check-circle', color: 'verde' },
    { titulo: 'Incidentes recientes', valor: 0, icono: 'activity', color: 'rojo', detalle: 'Últimos 7 días' },
  ];

  protected readonly accesos = [
    { ruta: '/reportar', titulo: 'Reportar incidente', texto: 'Informa lo que sucede en tu comunidad.', icono: 'megaphone' },
    { ruta: '/mis-reportes', titulo: 'Mis reportes', texto: 'Consulta el estado de tus reportes.', icono: 'file-text' },
    { ruta: '/mapa', titulo: 'Mapa', texto: 'Mira los incidentes en el mapa.', icono: 'map' },
    { ruta: '/perfil', titulo: 'Mi perfil', texto: 'Revisa tu información personal.', icono: 'user' },
  ];

  protected readonly recientes = REPORTES_DEMO.slice(0, 4);
  protected readonly claseEstado = CLASE_ESTADO;
}
