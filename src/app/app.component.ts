import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  constructor(public router: Router) {}

  hideHeaderFooter() {
    // Updated: Added 'reset-password' to hide on this page too
    return this.router.url.includes('login') || 
           this.router.url.includes('register') || 
           this.router.url.includes('forgot-password') ||
           this.router.url.includes('reset-password');  // Fixed: Added missing ||
  }
}