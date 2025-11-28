import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  mobileMenuOpen = false;
  isLoggedIn = false;
  currentUser: any = null;
  initials: string = '';

  ngOnInit() {
    this.checkAuthStatus();
  }

  checkAuthStatus() {
    const token = localStorage.getItem('authToken');
    const userStr = localStorage.getItem('currentUser');
    this.isLoggedIn = !!token && !!userStr;
    if (this.isLoggedIn && userStr) {
      this.currentUser = JSON.parse(userStr);
      // console.log('User:', this.currentUser);
      // console.log('Current User:', this.currentUser);
      this.initials = this.getInitials(this.currentUser.fullName || '');
    }
  }


  getInitials(name: string): string {
    const names = name.split(' ');
    let initials = names[0].charAt(0).toUpperCase();
    if (names.length > 1) {
      initials += names[names.length - 1].charAt(0).toUpperCase();
    }
    return initials;
  }

  toggleMenu() {
    this.mobileMenuOpen = !this.mobileMenuOpen;
  }

  logout() {
      localStorage.clear();
      sessionStorage.clear();
      this.isLoggedIn = false;
      this.currentUser = null;
    // Optionally navigate to home or login
  }
}