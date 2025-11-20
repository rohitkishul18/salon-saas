import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'home',
    loadChildren: () => import('./app/pages/home/home.module').then(m => m.HomeModule)
  },
  { path: 'branch/:branchSlug', loadChildren: () => import('./app/pages/branch/branch.module').then(m => m.BranchModule) },  // Changed :locationSlug to :branchSlug
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

@NgModule({
  imports: [RouterModule.forRoot(routes, { scrollPositionRestoration: 'enabled' })],
  exports: [RouterModule]
})
export class AppRoutingModule { }