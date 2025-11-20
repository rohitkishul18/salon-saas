import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './app/shared/header/header.component';
import { FooterComponent } from './app/shared/footer/footer.component';
import { ToastComponent } from './app/shared/toast/toast.component';
import { ServiceCardComponent } from './app/shared/service-card/service-card.component';
import { BranchCardComponent } from './app/shared/branch-card/branch-card.component';
import { share } from 'rxjs';
import { SharedModule } from './app/shared/shared.module';

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    SharedModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
