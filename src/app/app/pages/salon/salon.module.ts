import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SalonRoutingModule } from './salon-routing.module';
import { SalonComponent } from './salon.component';


@NgModule({
  declarations: [
    SalonComponent
  ],
  imports: [
    CommonModule,
    SalonRoutingModule
  ]
})
export class SalonModule { }
