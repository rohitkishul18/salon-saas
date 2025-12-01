import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { ApiService } from 'src/app/core/services/api.service';

@Component({
  selector: 'app-branch',
  templateUrl: './branch.component.html',
  styleUrls: ['./branch.component.scss'],
})
export class BranchComponent implements OnInit, OnDestroy {
  branchSlug!: string;

  branchData: any = null;
  salonData: any = null;
  services: any[] = [];
  minDateTime: string = '';
  bookingForm: FormGroup;
  isLoading: boolean = true;
  isSubmitting: boolean = false;

  // Success Modal State
  showSuccessModal: boolean = false;
  bookingDetails: any = null;

  // Error Modal State
  showErrorModal: boolean = false;
  errorMessage: string = '';

  // Time validation subscription
  private timeSubscription?: Subscription;

  // Banner images for branches
  private branchBannerImages: string[] = [
    'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=1600&h=900&fit=crop',
    'https://images.unsplash.com/photo-1562322140-8baeececf3df?w=1600&h=900&fit=crop',
    'https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?w=1600&h=900&fit=crop',
    'https://images.unsplash.com/photo-1633681926022-84c23e8cb2d6?w=1600&h=900&fit=crop',
    'https://images.unsplash.com/photo-1522337660859-02fbefca4702?w=1600&h=900&fit=crop',
    'https://images.unsplash.com/photo-1487412947147-5cebfaa6381f?w=1600&h=900&fit=crop',
  ];

  private imageRotationInterval: any;

  constructor(
    private route: ActivatedRoute,
    private api: ApiService,
    private fb: FormBuilder
  ) {
    this.bookingForm = this.fb.group({
      customerName: ['', [Validators.required, Validators.minLength(2)]],
      customerPhone: [
        '',
        [Validators.required, Validators.pattern(/^[6-9]\d{9}$/)],
      ],
      serviceId: ['', Validators.required],
      scheduledAt: ['', Validators.required],
      notes: [''],
    });
  }

  ngOnInit(): void {
    this.minDateTime = new Date(Date.now() + 60 * 60 * 1000)
      .toISOString()
      .slice(0, 16);

    this.branchSlug = this.route.snapshot.paramMap.get('branchSlug')!;
    this.loadBranchData();
    this.startImageRotation();
  }

  ngOnDestroy(): void {
    if (this.imageRotationInterval) {
      clearInterval(this.imageRotationInterval);
    }
    this.timeSubscription?.unsubscribe();
  }

  loadBranchData() {
    this.isLoading = true;

    this.api.getBranchBySlug(this.branchSlug).subscribe({
      next: (res: any) => {
        // console.log('Branch API Response:', res);

        if (res.success) {
          // console.log('Branch Data:', res.data.branch);
          this.branchData = res.data.branch;
          this.salonData = res.data.salon;
          this.services = res.data.services || [];

          if (this.branchData) {
            if (!this.branchData.bannerImage) {
              this.branchData.bannerImage = this.getRandomBannerImage();
            }

            if (this.salonData && !this.branchData.salonName) {
              this.branchData.salonName = this.salonData.name;
            }

            if (!this.branchData.rating) {
              this.branchData.rating = '4.5';
            }

            if (!this.branchData.reviewCount) {
              this.branchData.reviewCount = 0 + Math.floor(Math.random() * 100);
            }

            if (this.branchData.openingHours) {
              const formatted = this.formatOpeningHours(
                this.branchData.openingHours
              );
              this.branchData.openingHours = formatted;
            } else {
              this.branchData.openingHours = { from: '9 AM', to: '9 PM' };
            }
          }

          // Setup time validation after loading branch data
          this.setupTimeValidation(); 
        } else {
          console.error('API returned success: false');
          this.showError('Failed to load branch details. Please try again.');
        }

        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading branch:', err);
        this.isLoading = false;
        this.showError('Error loading branch details. Please try again later.');
      },
    });
  }

  private setupTimeValidation(): void {
    if (!this.branchData?.openingHours) return;

    this.timeSubscription = this.bookingForm.get('scheduledAt')!.valueChanges.subscribe(value => {
      if (!value) return;

      const scheduledDate = new Date(value);
      const scheduledTime = scheduledDate.getHours() * 60 + scheduledDate.getMinutes();

      const openTime = this.parseTime(this.branchData.openingHours.from);
      const closeTime = this.parseTime(this.branchData.openingHours.to);

      const isValidTime = scheduledTime >= openTime && scheduledTime <= closeTime;

      const control = this.bookingForm.get('scheduledAt');
      const currentErrors = control?.errors || {};

      if (isValidTime) {
        delete currentErrors['invalidTime'];
        control?.setErrors(Object.keys(currentErrors).length > 0 ? currentErrors : null);
      } else {
        currentErrors['invalidTime'] = true;
        control?.setErrors(currentErrors);
      }
    });
  }

  private parseTime(timeStr: string): number {
    const [time, period] = timeStr.split(' ');
    const parts = time.split(':');
    const hours = parseInt(parts[0], 10);
    const minutes = parts[1] ? parseInt(parts[1], 10) : 0;
    let totalMinutes = hours * 60 + minutes;

    if (period === 'PM' && hours !== 12) {
      totalMinutes += 12 * 60;
    } else if (period === 'AM' && hours === 12) {
      totalMinutes -= 12 * 60;
    }

    return totalMinutes;
  }

  formatOpeningHours(openingHours: string) {
    const [from, to] = openingHours.split(' - ');

    return {
      from: this.convertTo12Hour(from),
      to: this.convertTo12Hour(to)
    };
  }

  convertTo12Hour(time: string): string {
    const [hourStr, minuteStr] = time.split(':');
    const hour = parseInt(hourStr, 10);
    const minute = minuteStr ? parseInt(minuteStr, 10) : 0;
    let suffix = hour >= 12 ? 'PM' : 'AM';
    let convertedHour = hour % 12 || 12;

    return `${convertedHour}:${minute.toString().padStart(2, '0')} ${suffix}`;
  }

  // isOpen(): boolean {
  //   if (!this.branchData?.openingHours) return true;

  //   try {
  //     const now = new Date();
  //     const currentTime = now.getHours() * 60 + now.getMinutes();

  //     const openTime = this.parseTime(this.branchData.openingHours.from);
  //     const closeTime = this.parseTime(this.branchData.openingHours.to);

  //     return currentTime >= openTime && currentTime <= closeTime;
  //   } catch (error) {
  //     console.error('Error parsing opening hours:', error);
  //     return true;
  //   }
  // }

  private getRandomBannerImage(): string {
    const randomIndex = Math.floor(
      Math.random() * this.branchBannerImages.length
    );
    return `${this.branchBannerImages[randomIndex]}&t=${Date.now()}`;
  }

  private startImageRotation(): void {
    this.imageRotationInterval = setInterval(() => {
      if (this.branchData) {
        this.branchData.bannerImage = this.getRandomBannerImage();
      }
    }, 60000);
  }

  selectService(serviceId: string) {
    console.log('Selected Service:', serviceId);
    this.bookingForm.patchValue({
      serviceId: serviceId,
    });
  }

  submitBooking() {
    if (this.bookingForm.invalid) {
      // console.log('Booking form is invalid');
      Object.keys(this.bookingForm.controls).forEach((key) => {
        this.bookingForm.get(key)?.markAsTouched();
      });
      this.showError('Please fill in all required fields correctly.');
      return;
    }

    const bookingData = {
      salonId: this.salonData._id,
      locationId: this.branchData._id,
      serviceId: this.bookingForm.value.serviceId,
      customerName: this.bookingForm.value.customerName,
      customerPhone: this.bookingForm.value.customerPhone,
      scheduledAt: new Date(this.bookingForm.value.scheduledAt).toISOString(),
      notes: this.bookingForm.value.notes || '',
    };

    // console.log('Submitting booking with data:', bookingData);

    this.isSubmitting = true;

    this.api.createBooking(bookingData).subscribe({
      next: (response: any) => {
        // console.log('Booking created successfully:', response);
        this.isSubmitting = false;

        const selectedService = this.services.find(
          (s) => s._id === bookingData.serviceId
        );
        const serviceName = selectedService
          ? selectedService.name
          : 'Selected Service';
        const servicePrice = selectedService ? selectedService.price : '';

        this.bookingDetails = {
          customerName: bookingData.customerName,
          customerPhone: bookingData.customerPhone,
          serviceName: serviceName,
          servicePrice: servicePrice,
          scheduledAt: new Date(bookingData.scheduledAt).toLocaleString(
            'en-IN',
            {
              dateStyle: 'medium',
              timeStyle: 'short',
            }
          ),
          location: this.branchData.name,
          salon: this.salonData.name,
          notes: bookingData.notes,
        };

        this.showSuccessModal = true;

        this.bookingForm.reset();

        this.minDateTime = new Date(Date.now() + 60 * 60 * 1000)
          .toISOString()
          .slice(0, 16);
      },
      error: (error) => {
        console.error('Booking creation failed:', error);
        this.isSubmitting = false;

        let errorMessage = 'Unable to complete your booking. Please try again.';

        if (error.error?.message) {
          errorMessage = error.error.message;
        } else if (error.status === 400) {
          errorMessage =
            'Invalid booking details. Please check your information and try again.';
        } else if (error.status === 404) {
          errorMessage =
            'Service or location not found. Please refresh the page and try again.';
        } else if (error.status === 0) {
          errorMessage =
            'Network error. Please check your internet connection.';
        }

        this.showError(errorMessage);
      },
    });
  }

  closeSuccessModal() {
    this.showSuccessModal = false;
    this.bookingDetails = null;
  }

  showError(message: string) {
    this.errorMessage = message;
    this.showErrorModal = true;
  }

  closeErrorModal() {
    this.showErrorModal = false;
    this.errorMessage = '';
  }

  getSelectedServiceName(): string {
    const serviceId = this.bookingForm.get('serviceId')?.value;
    const service = this.services.find((s) => s._id === serviceId);
    return service ? service.name : 'Unknown Service';
  }
}