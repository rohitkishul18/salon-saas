import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { BranchRoutingModule } from './branch-routing.module';
import { BranchComponent } from './branch.component';
import { SharedModule } from '../../shared/shared.module';

@NgModule({
  declarations: [
    BranchComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    BranchRoutingModule,
    SharedModule  // ✅ Import if you need any shared components
  ],
  providers: [DatePipe]
})
export class BranchModule { }