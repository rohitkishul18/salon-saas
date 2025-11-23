import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'home',
    loadChildren: () => import('./app/pages/home/home.module').then(m => m.HomeModule)
  },
  {
    path: 'branch/:branchSlug',
    loadChildren: () => import('./app/pages/branch/branch.module').then(m => m.BranchModule),
    canActivate: [authGuard]
  },
  {
    path: 'auth',
    loadChildren: () => import('./app/pages/auth/auth.module').then(m => m.AuthModule)
  },
  {
    path: '**',
    redirectTo: 'home'
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      scrollPositionRestoration: 'enabled',
      anchorScrolling: 'enabled',
      scrollOffset: [0, 64] // Adjust for fixed header
    })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }