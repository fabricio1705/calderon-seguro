import { Injectable, signal } from '@angular/core';

// Muestra mensajes breves de demostración en la esquina de la pantalla.
@Injectable({ providedIn: 'root' })
export class AvisoService {
  readonly mensaje = signal<string | null>(null);
  private temporizador?: ReturnType<typeof setTimeout>;

  mostrar(texto: string): void {
    clearTimeout(this.temporizador);
    this.mensaje.set(texto);
    this.temporizador = setTimeout(() => this.mensaje.set(null), 4500);
  }

  cerrar(): void {
    clearTimeout(this.temporizador);
    this.mensaje.set(null);
  }
}
