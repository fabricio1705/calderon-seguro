import { Routes } from '@angular/router';
import { Login } from './pages/login/login';
import { Inicio } from './pages/inicio/inicio';
import { Reportar } from './pages/reportar/reportar';
import { MisReportes } from './pages/mis-reportes/mis-reportes';
import { Mapa } from './pages/mapa/mapa';
import { Perfil } from './pages/perfil/perfil';
import { requiereSesion } from './sesion.service';

export const routes: Routes = [
  { path: '', redirectTo: 'inicio', pathMatch: 'full' },
  { path: 'login', component: Login, title: 'Iniciar sesión · Calderón Seguro' },
  { path: 'inicio', component: Inicio, title: 'Inicio · Calderón Seguro', canActivate: [requiereSesion] },
  { path: 'reportar', component: Reportar, title: 'Reportar incidente · Calderón Seguro', canActivate: [requiereSesion] },
  { path: 'mis-reportes', component: MisReportes, title: 'Mis reportes · Calderón Seguro', canActivate: [requiereSesion] },
  { path: 'mapa', component: Mapa, title: 'Mapa · Calderón Seguro', canActivate: [requiereSesion] },
  { path: 'perfil', component: Perfil, title: 'Mi perfil · Calderón Seguro', canActivate: [requiereSesion] },
  { path: '**', redirectTo: 'inicio' },
];
