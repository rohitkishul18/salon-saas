import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { BranchCardComponent } from './branch-card/branch-card.component';
import { AuthPopupComponent } from './auth-popup/auth-popup.component';


@NgModule({
  declarations: [
    HeaderComponent,
    FooterComponent,
    BranchCardComponent,
    AuthPopupComponent,
      
  ],
  imports: [
    CommonModule,
    RouterModule, 
  ],
  exports: [
    HeaderComponent,
    FooterComponent,
    BranchCardComponent,
    AuthPopupComponent,
    CommonModule,
  ]
})
export class SharedModule { }