// Tipos de los reportes de la aplicación.
// Los reportes se crean durante la sesión y viven solo en memoria (ver reportes.service.ts).

export type EstadoReporte = 'Pendiente' | 'En revisión' | 'Atendido' | 'Cerrado';

export interface FotoReporte {
  nombre: string;
  url: string; // URL temporal del navegador (blob:); la imagen nunca sale del equipo
}

export interface ReporteDemo {
  id: string; // identificador interno único de la sesión
  codigo: string; // identificador local de demostración (p. ej. DEMO-001), no es un código oficial
  categoria: string;
  icono: string;
  fecha: string; // fecha del incidente (dd/mm/aaaa)
  hora: string; // hora del incidente (hh:mm)
  ubicacion: string;
  estado: EstadoReporte;
  descripcion: string;
  fotos: FotoReporte[];
  usuario: string; // nombre con el que se inició la sesión
  creado: Date; // momento en que se confirmó el reporte
}

// Categorías de incidente. Cada una tiene un color propio para su icono
// (color del trazo y un fondo suave del mismo tono).
export interface CategoriaIncidente {
  id: string;
  nombre: string;
  icono: string;
  color: string;
  fondo: string;
}

export const CATEGORIAS: CategoriaIncidente[] = [
  { id: 'robo', nombre: 'Robo', icono: 'wallet', color: '#dc2626', fondo: '#fee2e2' },
  { id: 'hurto', nombre: 'Hurto', icono: 'bag', color: '#db2777', fondo: '#fce7f3' },
  { id: 'accidente', nombre: 'Accidente de tránsito', icono: 'car', color: '#2563eb', fondo: '#dbeafe' },
  { id: 'violencia', nombre: 'Violencia', icono: 'alert-octagon', color: '#991b1b', fondo: '#f9dede' },
  { id: 'vandalismo', nombre: 'Vandalismo', icono: 'hammer', color: '#b45309', fondo: '#fef3c7' },
  { id: 'incendio', nombre: 'Incendio', icono: 'flame', color: '#ea580c', fondo: '#ffedd5' },
  { id: 'sospechosa', nombre: 'Actividad sospechosa', icono: 'eye', color: '#7c3aed', fondo: '#ede9fe' },
  { id: 'otro', nombre: 'Otro', icono: 'more', color: '#64748b', fondo: '#eef2f6' },
];

// Estilo (color y fondo) del icono de una categoría, a partir del nombre del icono.
// Se usa en las listas y detalles de reportes para que coincidan con «Reportar incidente».
export function estiloCategoria(icono: string): { color: string; background: string } {
  const categoria = CATEGORIAS.find((c) => c.icono === icono) ?? CATEGORIAS[CATEGORIAS.length - 1];
  return { color: categoria.color, background: categoria.fondo };
}

export const CLASE_ESTADO: Record<EstadoReporte, string> = {
  Pendiente: 'badge-pendiente',
  'En revisión': 'badge-revision',
  Atendido: 'badge-atendido',
  Cerrado: 'badge-cerrado',
};

export const COLOR_ESTADO: Record<EstadoReporte, string> = {
  Pendiente: '#f59e0b',
  'En revisión': '#2563eb',
  Atendido: '#16a34a',
  Cerrado: '#64748b',
};
