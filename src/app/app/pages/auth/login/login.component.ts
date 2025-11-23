import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidatorFn } from '@angular/forms';
import { Router } from '@angular/router';
import { CustomerAuthService } from '../../../../core/services/customer-auth.service.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  showPassword = false;
  isLoading = false;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: CustomerAuthService
  ) {}

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: [
        '',
        [
          Validators.required,
          Validators.email,
          Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)
        ]
      ],
      password: ['', [Validators.required, Validators.minLength(6), this.uppercaseValidator()]],
      rememberMe: [false]
    });

    // Redirect if already logged in
    const token = localStorage.getItem('authToken');
    if (token) {
      this.router.navigate(['/home']);
    }
  }

  // Custom validator for uppercase character
  uppercaseValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      if (!control.value || control.value.length === 0) {
        return null;
      }
      const hasUppercase = /[A-Z]/.test(control.value);
      return hasUppercase ? null : { uppercase: { value: control.value } };
    };
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  get email() {
    return this.loginForm.get('email');
  }

  get password() {
    return this.loginForm.get('password');
  }

  // Better validation messages
  getEmailError(): string {
    if (this.email?.touched || this.email?.dirty) {
      if (this.email.hasError('required')) return 'Email is required';
      if (this.email.hasError('email') || this.email.hasError('pattern'))
        return 'Enter a valid email address';
    }
    return '';
  }

  getPasswordError(): string {
    if (this.password?.touched || this.password?.dirty) {
      if (this.password.hasError('required')) return 'Password is required';
      if (this.password.hasError('minlength')) return 'Password must be at least 6 characters';
      if (this.password.hasError('uppercase')) return 'Password must contain at least one uppercase letter';
    }
    return '';
  }

  onSubmit(): void {
    this.loginForm.markAllAsTouched();

    if (this.loginForm.invalid) {
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    const { email, password, rememberMe } = this.loginForm.value;

    const loginData = { email, password };

    this.authService.login(loginData).subscribe({
      next: (response: any) => {
        this.isLoading = false;

        console.log('Login successful:', response);

        if (response?.data?.token) {
          localStorage.setItem('authToken', response.data.token);
          localStorage.setItem('currentUser', JSON.stringify(response.data.customer));
          localStorage.setItem('salonId', response.data.customer.salonId);

          // Remember Me
          if (rememberMe) localStorage.setItem('rememberMe', 'true');
          else localStorage.removeItem('rememberMe');

          this.router.navigate(['/home']);
        }
      },
      error: (err) => {
        this.isLoading = false;

        // API structure: { success: false, message: "..." }
        if (err.error?.message) {
          this.errorMessage = err.error.message;
        } else {
          this.errorMessage = 'Something went wrong. Please try again.';
        }
      }
    });
  }
}