import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

// Shared Components
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { ServiceCardComponent } from './service-card/service-card.component';
import { BranchCardComponent } from './branch-card/branch-card.component';
import { ToastComponent } from './toast/toast.component';
import { AuthPopupComponent } from './auth-popup/auth-popup.component';


@NgModule({
  declarations: [
    HeaderComponent,
    FooterComponent,
    ServiceCardComponent,
    BranchCardComponent,
    ToastComponent,
    AuthPopupComponent,
      
  ],
  imports: [
    CommonModule,
    RouterModule,  // Add RouterModule for routerLink to work
  ],
  exports: [
    // Export all components that will be used in other modules
    HeaderComponent,
    FooterComponent,
    ServiceCardComponent,
    BranchCardComponent,
    ToastComponent,
    AuthPopupComponent,
    // Export CommonModule so feature modules don't need to import it
    CommonModule,
  ]
})
export class SharedModule { }