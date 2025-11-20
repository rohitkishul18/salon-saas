import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SalonComponent } from './salon.component';

const routes: Routes = [{ path: '', component: SalonComponent },
  {
    path: ':locationSlug',
    loadChildren: () =>
      import('../branch/branch.module').then(m => m.BranchModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SalonRoutingModule { }
