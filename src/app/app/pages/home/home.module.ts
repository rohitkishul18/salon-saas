import { NgModule } from '@angular/core';
import { HomeRoutingModule } from './home-routing.module';
import { HomeComponent } from './home.component';
import { SharedModule } from '../../shared/shared.module';

@NgModule({
  declarations: [
    HomeComponent
    // ❌ DON'T declare BranchCardComponent here - it's already in SharedModule
  ],
  imports: [
    SharedModule,        // ✅ Import SharedModule to use BranchCardComponent
    HomeRoutingModule
  ]
})
export class HomeModule { }