import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { Router } from '@angular/router';
import { CustomerAuthService } from '../../../../core/services/customer-auth.service.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  registerForm: FormGroup;
  showPassword = false;
  showConfirmPassword = false;
  isLoading = false;
  errorMessage = '';
  showPrivacyModal = false;
  showTermsModal = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: CustomerAuthService,
  ) {
    this.registerForm = this.fb.group({
      fullName: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [
        Validators.required, 
        Validators.email,
        Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)
      ]],
      phone: ['', [Validators.required, Validators.pattern(/^[6-9]\d{9}$/)]],
      password: ['', [Validators.required, Validators.minLength(6), this.uppercaseValidator()]],
      confirmPassword: ['', Validators.required],
      agreeToTerms: [false, Validators.requiredTrue]
    }, {
      validators: this.passwordMatchValidator
    });
  }

  ngOnInit(): void {
    // Check if user is already logged in
    const token = localStorage.getItem('authToken');
    if (token) {
      this.router.navigate(['/']);
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

  // Custom validator to check if passwords match
  passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
    const password = control.get('password');
    const confirmPassword = control.get('confirmPassword');

    if (!password || !confirmPassword) {
      return null;
    }

    return password.value === confirmPassword.value ? null : { passwordMismatch: true };
  }

  // Helper methods for form controls
  get fullName() {
    return this.registerForm.get('fullName');
  }

  get email() {
    return this.registerForm.get('email');
  }

  get phone() {
    return this.registerForm.get('phone');
  }

  get password() {
    return this.registerForm.get('password');
  }

  get confirmPassword() {
    return this.registerForm.get('confirmPassword');
  }

  get agreeToTerms() {
    return this.registerForm.get('agreeToTerms');
  }

  // Better validation messages
  getFullNameError(): string {
    if (this.fullName?.touched || this.fullName?.dirty) {
      if (this.fullName.hasError('required')) return 'Full name is required';
      if (this.fullName.hasError('minlength')) return 'Full name must be at least 2 characters';
    }
    return '';
  }

  getEmailError(): string {
    if (this.email?.touched || this.email?.dirty) {
      if (this.email.hasError('required')) return 'Email is required';
      if (this.email.hasError('email') || this.email.hasError('pattern')) return 'Please enter a valid email';
    }
    return '';
  }

  getPhoneError(): string {
    if (this.phone?.touched || this.phone?.dirty) {
      if (this.phone.hasError('required')) return 'Phone number is required';
      if (this.phone.hasError('pattern')) return 'Valid 10-digit phone number required';
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

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  toggleConfirmPasswordVisibility(): void {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  openTerms(event: Event): void {
    event.preventDefault();
    this.showTermsModal = true;
  }

  openPrivacy(event: Event): void {
    event.preventDefault();
    this.showPrivacyModal = true;
  }

  onSubmit(): void {
    // Mark all fields as touched to show validation errors
    this.registerForm.markAllAsTouched();

    if (this.registerForm.valid) {
      this.isLoading = true;
      this.errorMessage = '';

      const { fullName, email, phone, password } = this.registerForm.value;

      // Prepare registration data
      const registerData = {
        fullName,
        email,
        phone,
        password
      };

      // Call the API
      this.authService.register(registerData).subscribe({
        next: (response: any) => {
          // console.log('Registration successful:', response);
          
          // Handle successful registration
          if (response?.success && response?.data) {
            // Store auth data if token is provided
            if (response.data.token) {
              localStorage.setItem('authToken', response.data.token);
            }
            
            // Store customer data (consistent with login)
            localStorage.setItem('currentUser', JSON.stringify(response.data.customer));
            localStorage.setItem('salonId', response.data.customer.salonId);

            // Show success message
            this.errorMessage = '';
            
            // Navigate to home since token is provided
            this.router.navigate(['/home']);
          } else {
            this.errorMessage = response.message || 'Registration failed. Please try again.';
          }
          
          this.isLoading = false;
        },
        error: (error: any) => {
          // console.error('Registration error:', error);
          
          // Handle error response
          if (error.error?.message) {
            this.errorMessage = error.error.message;
          } else if (error.status === 0) {
            this.errorMessage = 'Unable to connect to server. Please check your internet connection.';
          } else if (error.status === 400) {
            this.errorMessage = error.error?.message || 'Invalid data provided. Please check your information.';
          } else if (error.status === 409) {
            this.errorMessage = 'Email already exists. Please use a different email or login.';
          } else if (error.status === 500) {
            this.errorMessage = 'Server error. Please try again later.';
          } else {
            this.errorMessage = 'Registration failed. Please try again.';
          }
          
          this.isLoading = false;
        },
        complete: () => {
          // console.log('Registration request completed');
        }
      });
    }
    // No else block needed - field errors will show via markAllAsTouched
  }
}