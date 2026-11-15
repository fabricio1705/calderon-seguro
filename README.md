# Calderón Seguro — Prototipo visual

Prototipo de navegación de una plataforma de seguridad ciudadana para la parroquia Abdón Calderón
(Portoviejo, Manabí, Ecuador). **Es solo una demostración**: no tiene backend, base de datos,
inicio de sesión real ni envío de reportes. Todos los datos son ficticios.

## Cómo iniciarlo

```bash
npm start
```

Luego abre en el navegador: http://localhost:4200/

## Pantallas

| Ruta            | Pantalla            |
| --------------- | ------------------- |
| `/inicio`       | Inicio              |
| `/reportar`     | Reportar incidente  |
| `/mis-reportes` | Mis reportes        |
| `/mapa`         | Mapa                |
| `/perfil`       | Mi perfil           |

## Estructura

```
src/app/
  app.*                 Diseño general: barra lateral, barra superior y avisos
  app.routes.ts         Rutas de las cinco pantallas
  icon/                 Iconos SVG propios (sin bibliotecas externas)
  mapa-ilustrativo/     Mapa SVG de demostración (usado en Reportar y Mapa)
  datos-demo.ts         Reportes ficticios de ejemplo
  aviso.service.ts      Mensajes breves de demostración
  pages/                Una carpeta por pantalla (HTML, CSS y TypeScript)
src/styles.css          Colores y estilos compartidos
```
