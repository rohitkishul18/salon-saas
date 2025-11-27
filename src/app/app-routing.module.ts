import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { AuthLayoutComponent } from './app/layouts/auth-layout/auth-layout.component';
import { MainLayoutComponent } from './app/layouts/main-layout/main-layout.component';
import { NotFoundComponent } from './app/pages/not-found/not-found.component';
import { HomeComponent } from './app/pages/home/home.component';

const routes: Routes = [

  // 🔹 Auth Layout
  {
    path: 'auth',
    component: AuthLayoutComponent,
    loadChildren: () => import('./app/pages/auth/auth.module').then(m => m.AuthModule)
  },

  // 🔹 Main Layout
  {
    path: '',
    component: MainLayoutComponent,
    children: [
      { path: '', redirectTo: 'home', pathMatch: 'full' },

      {
        path: 'home',
        loadChildren: () =>
          import('./app/pages/home/home.module').then(m => m.HomeModule),
      },

      {
        path: 'branch/:branchSlug',
        loadChildren: () =>
          import('./app/pages/branch/branch.module').then(m => m.BranchModule),
      },
    ]
  },

  // 🔹 Standalone Not Found
  { path: 'not-found', component: NotFoundComponent },

  // 🔹 Not Found Catch All
  { path: '**', redirectTo: 'not-found' },
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