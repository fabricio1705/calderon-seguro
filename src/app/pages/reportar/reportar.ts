import { Component, OnDestroy, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Icon } from '../../icon/icon';
import { AvisoService } from '../../aviso.service';
import { CATEGORIAS } from '../../datos-demo';

interface FotoTemporal {
  nombre: string;
  url: string; // URL temporal del navegador; la imagen nunca sale del equipo
}

const MAX_DESCRIPCION = 500;
const MAX_FOTOS = 3;
const MAX_TAMANO_MB = 5;

// Fecha y hora actuales como valores de ejemplo para los campos.
function fechaHoy(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

function horaActual(): string {
  const d = new Date();
  return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
}

@Component({
  selector: 'app-reportar',
  imports: [FormsModule, Icon],
  templateUrl: './reportar.html',
  styleUrl: './reportar.css',
})
export class Reportar implements OnDestroy {
  private readonly aviso = inject(AvisoService);

  protected readonly categorias = CATEGORIAS;

  protected readonly maxDescripcion = MAX_DESCRIPCION;
  protected readonly maxFotos = MAX_FOTOS;
  protected readonly maxTamanoMb = MAX_TAMANO_MB;

  // Estado del formulario (solo en memoria, nada se envía).
  protected readonly categoria = signal<string | null>(null);
  protected readonly fecha = signal(fechaHoy());
  protected readonly hora = signal(horaActual());
  protected readonly descripcion = signal('');
  protected readonly direccion = signal('');
  protected readonly fotos = signal<FotoTemporal[]>([]);

  protected readonly arrastrando = signal(false);
  protected readonly confirmarCancelar = signal(false);

  // Paso actual: el formulario o la pantalla de revisión. Ambos usan el mismo
  // estado, así que al volver al formulario se conserva todo lo escrito.
  protected readonly paso = signal<'formulario' | 'revision'>('formulario');
  protected readonly mostrarNoDisponible = signal(false);

  protected readonly categoriaSeleccionada = computed(
    () => this.categorias.find((c) => c.id === this.categoria()) ?? null,
  );

  // Fecha en formato legible, p. ej. «domingo, 8 de noviembre de 2026».
  protected readonly fechaLegible = computed(() => {
    const [anio, mes, dia] = this.fecha().split('-').map(Number);
    if (!anio || !mes || !dia) return null;
    return new Date(anio, mes - 1, dia).toLocaleDateString('es-EC', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  });

  protected readonly tieneDatos = computed(
    () =>
      this.categoria() !== null ||
      this.descripcion().trim() !== '' ||
      this.direccion().trim() !== '' ||
      this.fotos().length > 0,
  );

  usarMiUbicacion(): void {
    // No se solicita GPS: solo se informa que la función llegará más adelante.
    this.aviso.mostrar('La ubicación actual estará disponible en una futura versión. Por ahora, puedes escribir una dirección o referencia del lugar.');
  }

  // ----- Fotos -----
  alSeleccionarArchivos(evento: Event): void {
    const campo = evento.target as HTMLInputElement;
    this.agregarFotos(campo.files);
    campo.value = '';
  }

  alSoltar(evento: DragEvent): void {
    evento.preventDefault();
    this.arrastrando.set(false);
    this.agregarFotos(evento.dataTransfer?.files ?? null);
  }

  alArrastrar(evento: DragEvent): void {
    evento.preventDefault();
    this.arrastrando.set(true);
  }

  private agregarFotos(archivos: FileList | null): void {
    if (!archivos) return;
    for (const archivo of Array.from(archivos)) {
      if (this.fotos().length >= MAX_FOTOS) {
        this.aviso.mostrar(`Puedes agregar hasta ${MAX_FOTOS} fotos.`);
        break;
      }
      if (!['image/jpeg', 'image/png'].includes(archivo.type)) {
        this.aviso.mostrar(`«${archivo.name}» no es una imagen JPG o PNG.`);
        continue;
      }
      if (archivo.size > MAX_TAMANO_MB * 1024 * 1024) {
        this.aviso.mostrar(`«${archivo.name}» supera los ${MAX_TAMANO_MB} MB.`);
        continue;
      }
      const foto = { nombre: archivo.name, url: URL.createObjectURL(archivo) };
      this.fotos.update((lista) => [...lista, foto]);
    }
  }

  quitarFoto(indice: number): void {
    URL.revokeObjectURL(this.fotos()[indice].url);
    this.fotos.update((lista) => lista.filter((_, i) => i !== indice));
  }

  // ----- Botones inferiores -----
  cancelar(): void {
    if (this.tieneDatos()) {
      this.confirmarCancelar.set(true);
    } else {
      this.aviso.mostrar('El formulario no tiene información que limpiar.');
    }
  }

  limpiarFormulario(): void {
    this.fotos().forEach((foto) => URL.revokeObjectURL(foto.url));
    this.categoria.set(null);
    this.fecha.set(fechaHoy());
    this.hora.set(horaActual());
    this.descripcion.set('');
    this.direccion.set('');
    this.fotos.set([]);
    this.confirmarCancelar.set(false);
  }

  // Primer «Siguiente»: muestra el resumen del reporte (no se envía nada).
  siguiente(): void {
    this.paso.set('revision');
    window.scrollTo({ top: 0 });
  }

  editarReporte(): void {
    this.paso.set('formulario');
    window.scrollTo({ top: 0 });
  }

  // Segundo «Siguiente», en la pantalla de revisión: solo informa.
  continuarDesdeRevision(): void {
    this.mostrarNoDisponible.set(true);
  }

  ngOnDestroy(): void {
    this.fotos().forEach((foto) => URL.revokeObjectURL(foto.url));
  }
}
