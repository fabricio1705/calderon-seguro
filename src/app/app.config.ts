import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter, withInMemoryScrolling } from '@angular/router';
import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    // Al cambiar de pantalla, la página vuelve arriba.
    provideRouter(routes, withInMemoryScrolling({ scrollPositionRestoration: 'top' })),
  ],
};
