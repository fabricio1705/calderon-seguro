import { Component, inject, signal } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { Icon } from './icon/icon';
import { AvisoService } from './aviso.service';
import { SesionService } from './sesion.service';

interface ItemMenu {
  ruta: string;
  etiqueta: string;
  icono: string;
}

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, RouterLinkActive, Icon],
  templateUrl: './app.html',
  styleUrl: './app.css',
  host: {
    '(document:click)': 'cerrarMenus()',
    '(document:keydown.escape)': 'cerrarMenus(); cerrarEcu()',
  },
})
export class App {
  protected readonly aviso = inject(AvisoService);
  protected readonly sesion = inject(SesionService);

  protected readonly menu: ItemMenu[] = [
    { ruta: '/inicio', etiqueta: 'Inicio', icono: 'home' },
    { ruta: '/reportar', etiqueta: 'Reportar incidente', icono: 'megaphone' },
    { ruta: '/mis-reportes', etiqueta: 'Mis reportes', icono: 'file-text' },
    { ruta: '/mapa', etiqueta: 'Mapa', icono: 'map' },
    { ruta: '/perfil', etiqueta: 'Mi perfil', icono: 'user' },
  ];

  // Aún no hay notificaciones.
  protected readonly notificaciones: { titulo: string; texto: string; hace: string }[] = [];

  protected readonly barraContraida = signal(false); // escritorio
  protected readonly menuMovilAbierto = signal(false); // teléfono
  protected readonly menuPerfilAbierto = signal(false);
  protected readonly notificacionesAbiertas = signal(false);

  // Ventana del acceso directo al ECU-911: confirmación y luego aviso informativo.
  // Solo es visual: no se realiza ninguna llamada ni se abre otra aplicación.
  protected readonly ecuPaso = signal<'confirmar' | 'informacion' | null>(null);

  alternarBarraLateral(): void {
    if (window.innerWidth <= 900) {
      this.menuMovilAbierto.update((abierto) => !abierto);
    } else {
      this.barraContraida.update((contraida) => !contraida);
    }
  }

  cerrarMenuMovil(): void {
    this.menuMovilAbierto.set(false);
  }

  alternarMenuPerfil(evento: Event): void {
    evento.stopPropagation();
    this.notificacionesAbiertas.set(false);
    this.menuPerfilAbierto.update((abierto) => !abierto);
  }

  alternarNotificaciones(evento: Event): void {
    evento.stopPropagation();
    this.menuPerfilAbierto.set(false);
    this.notificacionesAbiertas.update((abierto) => !abierto);
  }

  cerrarMenus(): void {
    this.menuPerfilAbierto.set(false);
    this.notificacionesAbiertas.set(false);
  }

  abrirEcu(): void {
    this.cerrarMenus();
    this.ecuPaso.set('confirmar');
  }

  continuarEcu(): void {
    this.ecuPaso.set('informacion');
  }

  cerrarEcu(): void {
    this.ecuPaso.set(null);
  }

  // Cierra la sesión de demostración y vuelve al formulario de inicio de sesión.
  cerrarSesion(): void {
    this.cerrarMenus();
    this.cerrarMenuMovil();
    this.cerrarEcu();
    this.sesion.cerrar();
  }
}
