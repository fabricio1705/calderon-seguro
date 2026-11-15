import { Injectable, computed, inject, signal } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

// Sesión de demostración: no hay autenticación real ni base de datos.
// Solo se recuerda el NOMBRE escrito por el usuario mientras dure la pestaña
// (sessionStorage). El correo y la contraseña nunca se guardan.
const CLAVE_NOMBRE = 'calderon-seguro.nombre';
const NOMBRE_GENERICO = 'Usuario';

function leerNombreGuardado(): string | null {
  try {
    return sessionStorage.getItem(CLAVE_NOMBRE);
  } catch {
    return null;
  }
}

@Injectable({ providedIn: 'root' })
export class SesionService {
  private readonly router = inject(Router);
  private readonly nombreSesion = signal<string | null>(leerNombreGuardado());

  readonly activa = computed(() => this.nombreSesion() !== null);
  readonly nombre = computed(() => this.nombreSesion() ?? NOMBRE_GENERICO);
  readonly inicial = computed(() => this.nombre().charAt(0).toUpperCase());

  iniciar(nombre: string): void {
    const limpio = nombre.trim() || NOMBRE_GENERICO;
    this.nombreSesion.set(limpio);
    try {
      sessionStorage.setItem(CLAVE_NOMBRE, limpio);
    } catch {
      // Sin almacenamiento disponible: el nombre queda solo en memoria.
    }
  }

  cerrar(): void {
    this.nombreSesion.set(null);
    try {
      sessionStorage.removeItem(CLAVE_NOMBRE);
    } catch {
      // Nada que limpiar.
    }
    this.router.navigateByUrl('/login');
  }
}

// Las pantallas internas solo se muestran después de «Iniciar sesión».
export const requiereSesion: CanActivateFn = () =>
  inject(SesionService).activa() || inject(Router).createUrlTree(['/login']);
