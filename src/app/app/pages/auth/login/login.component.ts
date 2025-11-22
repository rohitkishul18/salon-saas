import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CustomerAuthService } from '../../../../core/services/customer-auth.service.service';

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
    private router: Router,
    private authService: CustomerAuthService
  ) {
    // Fixed: Validators should be in an array
    this.loginForm = this.fb.group({
      email: ['', [
        Validators.required,
        Validators.email,
        Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)
      ]],
      password: ['', [
        Validators.required,
        Validators.minLength(6)
      ]],
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

  // Helper method to get form control easily
  get email() {
    return this.loginForm.get('email');
  }

  get password() {
    return this.loginForm.get('password');
  }

  // Helper methods to check specific validation errors
  getEmailError(): string {
    if (this.email?.hasError('required')) {
      return 'Email is required';
    }
    if (this.email?.hasError('email') || this.email?.hasError('pattern')) {
      return 'Please enter a valid email address';
    }
    return '';
  }

  getPasswordError(): string {
    if (this.password?.hasError('required')) {
      return 'Password is required';
    }
    if (this.password?.hasError('minLength')) {
      return 'Password must be at least 6 characters';
    }
    return '';
  }

  onSubmit(): void {
    // Mark all fields as touched to show validation errors
    this.loginForm.markAllAsTouched();

    if (this.loginForm.valid) {
      this.isLoading = true;
      this.errorMessage = '';

      const { email, password, rememberMe } = this.loginForm.value;

      // Prepare login data
      const loginData = {
        email,
        password
      };

      // Call the API
      this.authService.login(loginData).subscribe({
        next: (response: any) => {
          console.log('Login successful:', response);
          
          // Store auth data
          if (response.data && response.data.token) {
            localStorage.setItem('authToken', response.data.token);
            localStorage.setItem('currentUser', JSON.stringify(response.data.customer));
            localStorage.setItem('salonId', response.data.customer.salonId);
            
            // Store remember me preference
            if (rememberMe) {
              localStorage.setItem('rememberMe', 'true');
            }
            
            // Navigate to home or dashboard
            this.router.navigate(['/home']);
          } else {
            this.errorMessage = 'Invalid response from server';
          }
          
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Login error:', error);
          
          // Handle error response
          if (error.error && error.error.message) {
            this.errorMessage = error.error.message;
          } else if (error.status === 0) {
            this.errorMessage = 'Unable to connect to server. Please check your internet connection.';
          } else if (error.status === 401) {
            this.errorMessage = 'Invalid email or password';
          } else if (error.status === 500) {
            this.errorMessage = 'Server error. Please try again later.';
          } else {
            this.errorMessage = 'Login failed. Please try again.';
          }
          
          this.isLoading = false;
        },
        complete: () => {
          console.log('Login request completed');
        }
      });
    } else {
      // Show validation error message
      this.errorMessage = 'Please fill in all required fields correctly.';
    }
  }
}