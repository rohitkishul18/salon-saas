import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-auth-popup',
  templateUrl: './auth-popup.component.html',
  styleUrls: ['./auth-popup.component.scss']
})
export class AuthPopupComponent implements OnInit, OnDestroy {

  showPopup: boolean = false;
  private popupInterval: any;
  private popupTimeout: any;

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.checkAndShowPopup();
  }

  ngOnDestroy(): void {
    // Clear intervals and timeouts when component is destroyed
    if (this.popupInterval) {
      clearInterval(this.popupInterval);
    }
    if (this.popupTimeout) {
      clearTimeout(this.popupTimeout);
    }
  }

  checkAndShowPopup(): void {
    const token = localStorage.getItem('authToken');

    // Only show popup if user is NOT logged in
    if (!token) {
      // Show popup after 3 seconds
      this.popupTimeout = setTimeout(() => {
        this.showPopup = true;
      }, 3000);

      // Keep checking and showing popup every 3 seconds until user logs in
      this.popupInterval = setInterval(() => {
        const currentToken = localStorage.getItem('authToken');
        if (!currentToken) {
          this.showPopup = true;
        } else {
          // User logged in, stop showing popup
          this.clearPopupInterval();
        }
      }, 3000); // Show again every 3 seconds
    }
  }

  closePopup(): void {
    this.showPopup = false;
    // Popup will show again after the interval (30 seconds)
  }

  navigateToLogin(): void {
    this.showPopup = false;
    this.clearPopupInterval(); // Stop popup when navigating to login
    this.router.navigate(['/auth/login']);
  }

  navigateToRegister(): void {
    this.showPopup = false;
    this.clearPopupInterval(); // Stop popup when navigating to register
    this.router.navigate(['/auth/register']);
  }

  // Optional: Allow user to continue without auth
  continueAsGuest(): void {
    this.showPopup = false;
  }

  private clearPopupInterval(): void {
    if (this.popupInterval) {
      clearInterval(this.popupInterval);
      this.popupInterval = null;
    }
    if (this.popupTimeout) {
      clearTimeout(this.popupTimeout);
      this.popupTimeout = null;
    }
  }
}