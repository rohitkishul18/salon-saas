import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { Router } from '@angular/router';

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

  constructor(
    private fb: FormBuilder,
    private router: Router
  ) {
    this.registerForm = this.fb.group({
      fullName: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.pattern(/^[6-9]\d{9}$/)]],
      password: ['', [Validators.required, Validators.minLength(6)]],
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

  // Custom validator to check if passwords match
  passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
    const password = control.get('password');
    const confirmPassword = control.get('confirmPassword');

    if (!password || !confirmPassword) {
      return null;
    }

    return password.value === confirmPassword.value ? null : { passwordMismatch: true };
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  toggleConfirmPasswordVisibility(): void {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  onSubmit(): void {
    if (this.registerForm.valid) {
      this.isLoading = true;
      this.errorMessage = '';

      const { fullName, email, phone, password } = this.registerForm.value;

      // TODO: Replace with actual API call
      // Example: this.authService.register(fullName, email, phone, password).subscribe(...)
      
      // Simulated API call
      setTimeout(() => {
        console.log('Registration attempt:', { fullName, email, phone, password });
        
        // Simulated success
        const mockToken = 'mock-jwt-token-' + Date.now();
        const mockUser = {
          id: 'user' + Date.now(),
          name: fullName,
          email: email,
          phone: phone
        };

        // Store auth data
        localStorage.setItem('authToken', mockToken);
        localStorage.setItem('currentUser', JSON.stringify(mockUser));

        // Show success message
        alert(`Welcome ${fullName}! Your account has been created successfully.`);

        // Navigate to home
        this.router.navigate(['/']);
        this.isLoading = false;

        // Simulated error (uncomment to test)
        // this.errorMessage = 'Email already exists. Please use a different email.';
        // this.isLoading = false;
      }, 2000);
    }
  }
}