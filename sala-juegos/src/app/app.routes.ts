import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth-guard';
import { guestGuard } from './core/guards/guest-guard';

export const routes: Routes = [
  {
    path: 'home',
    loadComponent: () =>
      import('./features/home/home').then(m => m.Home)
  },
  {
    path: 'login',
    canActivate: [guestGuard],
    loadComponent: () =>
      import('./features/login/login').then(m => m.Login)
  },
  {
    path: 'register',
    canActivate: [guestGuard],
    loadComponent: () =>
      import('./features/register/register').then(m => m.RegisterComponent)
  },
  {
    path: 'quien-soy',
    loadComponent: () =>
      import('./features/quien-soy/quien-soy').then(m => m.QuienSoy)
  },
  {
    path: 'ahorcado',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/ahorcado/ahorcado').then(m => m.Ahorcado)
  },
  {
    path: 'mayor-menor',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/mayor-menor/mayor-menor').then(m => m.MayorMenor)
  },
  {
    path: 'chat',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/chat/chat').then(m => m.Chat)
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: '**',
    redirectTo: 'home'
  }
];