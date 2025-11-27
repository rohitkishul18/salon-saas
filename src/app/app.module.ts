import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SharedModule } from './app/shared/shared.module';
import { TokenInterceptor } from './core/interceptors/token.interceptor';
import { registerLocaleData } from '@angular/common';
import en from '@angular/common/locales/en';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MainLayoutComponent } from './app/layouts/main-layout/main-layout.component';
import { AuthLayoutComponent } from './app/layouts/auth-layout/auth-layout.component';
import { NotFoundComponent } from './app/pages/not-found/not-found.component';

registerLocaleData(en);

@NgModule({
  declarations: [
    AppComponent,
    MainLayoutComponent,
    AuthLayoutComponent,
    NotFoundComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,      // ✅ Add once at root level
    SharedModule,          // ✅ Import shared components
    AppRoutingModule, FormsModule, BrowserAnimationsModule       // ⚠️ Must be LAST for lazy loading to work
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptor,
      multi: true
    },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }