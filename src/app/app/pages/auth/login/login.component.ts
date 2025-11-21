import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  showPassword = false;
  isLoading = false;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      emailOrPhone: ['', Validators.required],
      password: ['', Validators.required],
      rememberMe: [false]
    });
  }

  ngOnInit(): void {
    // Check if user is already logged in
    const token = localStorage.getItem('authToken');
    if (token) {
      this.router.navigate(['/']);
    }
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      this.isLoading = true;
      this.errorMessage = '';

      const { emailOrPhone, password, rememberMe } = this.loginForm.value;

      // TODO: Replace with actual API call
      // Example: this.authService.login(emailOrPhone, password).subscribe(...)
      
      // Simulated API call
      setTimeout(() => {
        console.log('Login attempt:', { emailOrPhone, password, rememberMe });
        
        // Simulated success
        const mockToken = 'mock-jwt-token-' + Date.now();
        const mockUser = {
          id: 'user123',
          name: 'John Doe',
          email: emailOrPhone,
          phone: '+91 9876543210'
        };

        // Store auth data
        localStorage.setItem('authToken', mockToken);
        localStorage.setItem('currentUser', JSON.stringify(mockUser));

        // Navigate to home
        this.router.navigate(['/']);
        this.isLoading = false;

        // Simulated error (uncomment to test)
        // this.errorMessage = 'Invalid credentials. Please try again.';
        // this.isLoading = false;
      }, 1500);
    }
  }

}
