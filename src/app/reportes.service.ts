import { Injectable, computed, effect, inject, signal, untracked } from '@angular/core';
import { FotoReporte, ReporteDemo } from './datos-demo';
import { SesionService } from './sesion.service';

// Datos que entrega el formulario «Reportar incidente» al confirmar.
export interface NuevoReporte {
  categoria: string;
  icono: string;
  fecha: string;
  hora: string;
  ubicacion: string;
  descripcion: string;
  fotos: FotoReporte[];
}

const SIETE_DIAS_MS = 7 * 24 * 60 * 60 * 1000;

// Almacenamiento TEMPORAL de reportes, solo en la memoria de la aplicación.
// No usa localStorage, sessionStorage, IndexedDB, cookies, servidores ni servicios externos:
// al recargar o cerrar la pestaña la memoria se pierde, y al cerrar sesión se limpia.
@Injectable({ providedIn: 'root' })
export class ReportesService {
  private readonly sesion = inject(SesionService);

  // Lista ordenada del más reciente al más antiguo.
  private readonly lista = signal<ReporteDemo[]>([]);
  private contador = 0;

  /** Todos los reportes guardados en memoria en esta sesión. */
  readonly reportes = this.lista.asReadonly();

  /** Reportes creados por el usuario de la sesión actual. */
  readonly misReportes = computed(() => {
    const usuario = this.sesion.nombre();
    return this.lista().filter((r) => r.usuario === usuario);
  });

  readonly total = computed(() => this.misReportes().length);
  readonly pendientes = computed(() => this.misReportes().filter((r) => r.estado === 'Pendiente').length);
  readonly atendidos = computed(() => this.misReportes().filter((r) => r.estado === 'Atendido').length);
  readonly ultimosSieteDias = computed(() => {
    const limite = Date.now() - SIETE_DIAS_MS;
    return this.misReportes().filter((r) => r.creado.getTime() >= limite).length;
  });

  constructor() {
    // Si la sesión termina o cambia de usuario, se borran los reportes de la sesión anterior.
    let usuarioAnterior = this.usuarioActual();
    effect(() => {
      const usuario = this.usuarioActual();
      if (usuario !== usuarioAnterior) {
        usuarioAnterior = usuario;
        untracked(() => this.limpiar());
      }
    });
  }

  /** Crea un reporte con estado «Pendiente» y lo agrega al inicio de la lista. */
  agregar(datos: NuevoReporte): ReporteDemo {
    this.contador++;
    const reporte: ReporteDemo = {
      ...datos,
      id: `local-${Date.now()}-${this.contador}`,
      codigo: `DEMO-${String(this.contador).padStart(3, '0')}`,
      estado: 'Pendiente',
      usuario: this.sesion.nombre(),
      creado: new Date(),
    };
    this.lista.update((lista) => [reporte, ...lista]);
    return reporte;
  }

  /** Borra todos los reportes de la memoria (y libera las fotos temporales). */
  limpiar(): void {
    this.lista().forEach((r) => r.fotos.forEach((f) => URL.revokeObjectURL(f.url)));
    this.lista.set([]);
    this.contador = 0;
  }

  private usuarioActual(): string | null {
    return this.sesion.activa() ? this.sesion.nombre() : null;
  }
}
