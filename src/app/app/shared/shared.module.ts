import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { ServiceCardComponent } from './service-card/service-card.component';
import { BranchCardComponent } from './branch-card/branch-card.component';
import { ToastComponent } from './toast/toast.component';

@NgModule({
  declarations: [
    HeaderComponent,
    FooterComponent,
    ServiceCardComponent,
    BranchCardComponent,
    ToastComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [
    HeaderComponent,
    FooterComponent
  ]
})
export class SharedModule { }
