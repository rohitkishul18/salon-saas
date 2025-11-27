import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidatorFn } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CustomerAuthService } from '../../../../core/services/customer-auth.service.service'; // Adjust path

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent implements OnInit {
  resetForm!: FormGroup;
  isLoading = false;
  errorMessage = '';
  successMessage = '';
  showSuccess = false;
  token: string = '';
  email: string = '';
  showPassword: boolean = false;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private authService: CustomerAuthService
  ) {}

  ngOnInit(): void {
    // Extract token and email from query params
    this.route.queryParams.subscribe(params => {
      this.token = params['token'] || '';
      this.email = params['email'] || '';
      
      if (!this.token || !this.email) {
        this.errorMessage = 'Invalid reset link. Please request a new one.';
        return;
      }
    });

    // Form with new password + confirm
    this.resetForm = this.fb.group({
      newPassword: ['', [Validators.required, Validators.minLength(6), this.uppercaseValidator()]],
      confirmPassword: ['', [Validators.required, this.confirmPasswordValidator()]]
    });
  }

  // Custom validators
  uppercaseValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      if (!control.value || control.value.length === 0) return null;
      return /[A-Z]/.test(control.value) ? null : { uppercase: true };
    };
  }

  confirmPasswordValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      return control.value === this.resetForm?.get('newPassword')?.value ? null : { mismatch: true };
    };
  }

  onSubmit(): void {
    if (this.resetForm.invalid || !this.token || !this.email) {
      this.resetForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';
    this.successMessage = '';

    const { newPassword } = this.resetForm.value;

    this.authService.resetPassword({ token: this.token, email: this.email, newPassword }).subscribe({
      next: (response: any) => {
        this.isLoading = false;
        this.successMessage = response.message || 'Password reset successful! You can now log in.';
        this.showSuccess = true;
        this.resetForm.disable(); 
        // Auto-redirect to login after 3s (optional)
        setTimeout(() => this.router.navigate(['/auth/login']), 3000);
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = err.error?.message || 'Reset failed. Token may be invalid/expired. Request a new one.';
      }
    });
  }

  backToLogin(): void {
    this.router.navigate(['/auth/login']);
  }

  get newPassword() {
    return this.resetForm.get('newPassword');
  }

  get confirmPassword() {
    return this.resetForm.get('confirmPassword');
  }

  getPasswordError(): string {
    if (this.newPassword?.touched) {
      if (this.newPassword.hasError('required')) return 'New password is required';
      if (this.newPassword.hasError('minlength')) return 'At least 6 characters';
      if (this.newPassword.hasError('uppercase')) return 'One uppercase letter required';
    }
    return '';
  }

  getConfirmError(): string {
    if (this.confirmPassword?.touched && this.confirmPassword.hasError('mismatch')) {
      return 'Passwords do not match';
    }
    return '';
  }
}