import { Component, OnDestroy, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Icon } from '../../icon/icon';
import { AvisoService } from '../../aviso.service';
import { CATEGORIAS, ReporteDemo } from '../../datos-demo';
import { ReportesService } from '../../reportes.service';

interface FotoTemporal {
  nombre: string;
  url: string; // URL temporal del navegador; la imagen nunca sale del equipo
}

const MAX_DESCRIPCION = 500;
const MAX_FOTOS = 3;
const MAX_TAMANO_MB = 5;

type Paso = 'formulario' | 'revision' | 'confirmacion';
type CampoObligatorio = 'categoria' | 'direccion' | 'descripcion';

// Secuencia del proceso de reporte (indicador «Paso X de 3»).
const PASOS: { id: Paso; nombre: string }[] = [
  { id: 'formulario', nombre: 'Completar reporte' },
  { id: 'revision', nombre: 'Revisar reporte' },
  { id: 'confirmacion', nombre: 'Confirmación' },
];

// Id del elemento que recibe el foco al corregir cada campo obligatorio.
const ID_CAMPO: Record<CampoObligatorio, string> = {
  categoria: 'campo-categoria',
  direccion: 'direccion',
  descripcion: 'descripcion',
};

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
  imports: [FormsModule, RouterLink, Icon],
  templateUrl: './reportar.html',
  styleUrl: './reportar.css',
})
export class Reportar implements OnDestroy {
  private readonly aviso = inject(AvisoService);
  private readonly reportes = inject(ReportesService);

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

  // Paso actual del proceso. Los tres pasos usan el mismo estado, así que al
  // volver al formulario se conserva todo lo escrito.
  protected readonly pasos = PASOS;
  protected readonly paso = signal<Paso>('formulario');
  protected readonly numeroPaso = computed(() => PASOS.findIndex((p) => p.id === this.paso()) + 1);
  protected readonly nombrePaso = computed(() => PASOS[this.numeroPaso() - 1].nombre);

  // Los errores solo se muestran después de pulsar «Revisar reporte».
  protected readonly intentoRevisar = signal(false);
  // Último reporte guardado en memoria (se muestra en la confirmación).
  protected readonly reporteGuardado = signal<ReporteDemo | null>(null);
  protected readonly faltantes = computed(() => ({
    categoria: this.categoria() === null,
    direccion: this.direccion().trim() === '',
    descripcion: this.descripcion().trim() === '',
  }));
  protected readonly error = computed(() => {
    const f = this.faltantes();
    const mostrar = this.intentoRevisar();
    return { categoria: mostrar && f.categoria, direccion: mostrar && f.direccion, descripcion: mostrar && f.descripcion };
  });

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

  // revocarFotos = false cuando las fotos pasaron a un reporte guardado y deben seguir visibles.
  limpiarFormulario(revocarFotos = true): void {
    if (revocarFotos) this.fotos().forEach((foto) => URL.revokeObjectURL(foto.url));
    this.categoria.set(null);
    this.fecha.set(fechaHoy());
    this.hora.set(horaActual());
    this.descripcion.set('');
    this.direccion.set('');
    this.fotos.set([]);
    this.intentoRevisar.set(false);
    this.confirmarCancelar.set(false);
  }

  // Paso 1 → 2: comprueba los campos obligatorios antes de mostrar el resumen.
  revisarReporte(): void {
    this.intentoRevisar.set(true);
    const f = this.faltantes();
    const primero = (Object.keys(f) as CampoObligatorio[]).find((campo) => f[campo]);
    if (primero) {
      this.enfocar(ID_CAMPO[primero]);
      return;
    }
    this.irAPaso('revision');
  }

  // Paso 2 → 1: vuelve al formulario con los datos intactos (opcionalmente a un campo concreto).
  volverAEditar(campo?: CampoObligatorio): void {
    this.irAPaso('formulario');
    if (campo) setTimeout(() => this.enfocar(ID_CAMPO[campo]));
  }

  // Paso 2 → 3: guarda el reporte en la memoria de la sesión (no se envía a ningún servidor).
  confirmar(): void {
    const categoria = this.categoriaSeleccionada();
    if (!categoria) return;
    const [anio, mes, dia] = this.fecha().split('-');
    const guardado = this.reportes.agregar({
      categoria: categoria.nombre,
      icono: categoria.icono,
      fecha: anio && mes && dia ? `${dia}/${mes}/${anio}` : '',
      hora: this.hora(),
      ubicacion: this.direccion().trim(),
      descripcion: this.descripcion().trim(),
      fotos: [...this.fotos()],
    });
    this.reporteGuardado.set(guardado);
    // Las fotos ahora pertenecen al reporte guardado: se vacía el formulario sin liberarlas.
    this.limpiarFormulario(false);
    this.irAPaso('confirmacion');
  }

  // Desde la confirmación: empieza un reporte nuevo y vacío.
  nuevoReporte(): void {
    this.limpiarFormulario();
    this.irAPaso('formulario');
  }

  private irAPaso(paso: Paso): void {
    this.paso.set(paso);
    window.scrollTo({ top: 0 });
  }

  private enfocar(id: string): void {
    const el = document.getElementById(id);
    el?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    el?.focus({ preventScroll: true });
  }

  ngOnDestroy(): void {
    this.fotos().forEach((foto) => URL.revokeObjectURL(foto.url));
  }
}
