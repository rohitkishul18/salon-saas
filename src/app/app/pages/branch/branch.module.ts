import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { BranchComponent } from './branch.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BranchRoutingModule } from './branch-routing.module';
import { HttpClientModule } from '@angular/common/http';



@NgModule({
  declarations: [
    BranchComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    BranchRoutingModule,
    ReactiveFormsModule,
    HttpClientModule 
  ]
  ,providers: [DatePipe]
})
export class BranchModule { }
