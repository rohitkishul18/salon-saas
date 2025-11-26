import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CustomerAuthService } from '../../../../core/services/customer-auth.service.service'; // Adjust path

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent implements OnInit {
  forgotForm!: FormGroup;
  isLoading = false;
  errorMessage = '';
  successMessage = '';
  showSuccess = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: CustomerAuthService
  ) {}

  ngOnInit(): void {
    this.forgotForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  onSubmit(): void {
    if (this.forgotForm.invalid) {
      this.forgotForm.markAllAsTouched();
      
      // Custom error for email format (prevents typos like 'gamil.com')
      const emailControl = this.forgotForm.get('email');
      if (emailControl?.hasError('email')) {
        this.errorMessage = 'Invalid email format. Check for typos (e.g., gmail.com).';
        return;
      }
      
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';
    this.successMessage = '';

    const { email } = this.forgotForm.value;

    this.authService.forgotPassword({ email }).subscribe({
      next: (response: any) => {
        this.isLoading = false;
        this.successMessage = response.message || 'Reset link sent to your email! Check your inbox (including spam).';
        this.showSuccess = true;
        this.forgotForm.get('email')?.disable(); // Disable form on success
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = err.error?.message || 'Something went wrong. Please try again.';
      }
    });
  }

  backToLogin(): void {
    this.router.navigate(['/auth/login']);  // Full path to match your routing
  }
}