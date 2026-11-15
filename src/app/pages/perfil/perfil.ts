import { Component, computed, inject } from '@angular/core';
import { Icon } from '../../icon/icon';
import { AvisoService } from '../../aviso.service';
import { SesionService } from '../../sesion.service';

@Component({
  selector: 'app-perfil',
  imports: [Icon],
  templateUrl: './perfil.html',
  styleUrl: './perfil.css',
})
export class Perfil {
  private readonly aviso = inject(AvisoService);
  protected readonly sesion = inject(SesionService);

  // Usuario de prueba (no existe una cuenta real).
  protected readonly datos = computed(() => [
    { etiqueta: 'Nombre', valor: this.sesion.nombre(), icono: 'user' },
    { etiqueta: 'Rol', valor: 'Ciudadano', icono: 'shield-check' },
    { etiqueta: 'Comunidad', valor: 'Abdón Calderón', icono: 'home' },
    { etiqueta: 'Cantón', valor: 'Portoviejo', icono: 'building' },
    { etiqueta: 'Provincia', valor: 'Manabí', icono: 'map' },
    { etiqueta: 'País', valor: 'Ecuador', icono: 'globe' },
  ]);

  editarPerfil(): void {
    this.aviso.mostrar('La edición del perfil estará disponible en una futura versión. Esta demostración no guarda cambios.');
  }

  cerrarSesion(): void {
    this.sesion.cerrar();
  }
}
