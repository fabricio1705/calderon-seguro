import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Icon } from '../../icon/icon';
import { SesionService } from '../../sesion.service';

@Component({
  selector: 'app-login',
  imports: [FormsModule, Icon],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  private readonly sesion = inject(SesionService);
  private readonly router = inject(Router);

  // Campos del formulario (solo en memoria). Cualquier dato permite continuar.
  protected readonly nombre = signal('');
  protected readonly correo = signal('');
  protected readonly contrasena = signal('');

  iniciarSesion(): void {
    this.sesion.iniciar(this.nombre());
    // El correo y la contraseña no se guardan en ningún lugar.
    this.correo.set('');
    this.contrasena.set('');
    this.router.navigateByUrl('/inicio');
  }
}
