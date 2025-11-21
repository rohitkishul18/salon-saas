import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SharedModule } from './app/shared/shared.module';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,      // ✅ Add once at root level
    SharedModule,          // ✅ Import shared components
    AppRoutingModule       // ⚠️ Must be LAST for lazy loading to work
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }