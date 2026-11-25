import { Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Icon } from '../../icon/icon';
import { CLASE_ESTADO, estiloCategoria } from '../../datos-demo';
import { ReportesService } from '../../reportes.service';
import { AvisoService } from '../../aviso.service';
import { SesionService } from '../../sesion.service';

@Component({
  selector: 'app-perfil',
  imports: [RouterLink, Icon],
  templateUrl: './perfil.html',
  styleUrl: './perfil.css',
})
export class Perfil {
  private readonly aviso = inject(AvisoService);
  protected readonly sesion = inject(SesionService);
  // Estadísticas calculadas con los reportes creados en esta sesión (solo en memoria).
  protected readonly reportes = inject(ReportesService);
  protected readonly ultimos = computed(() => this.reportes.misReportes().slice(0, 3));
  protected readonly claseEstado = CLASE_ESTADO;
  protected readonly estiloCategoria = estiloCategoria;

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
