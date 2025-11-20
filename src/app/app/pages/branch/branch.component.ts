import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-branch',
  templateUrl: './branch.component.html',
  styleUrls: ['./branch.component.scss']
  // No standalone: true or imports here—handled in BranchModule
})
export class BranchComponent implements OnInit {
  branchSlug!: string;
  branchData: any = null;  // Static for now
  services: any[] = [];  // Static services
  minDateTime: string = '';  // For datetime-local min

  bookingForm: FormGroup;

  private salonId: string = 'static-salon-id';  // Static for testing
  private locationId: string = 'static-location-id';  // Static for testing

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private datePipe: DatePipe
  ) {
    this.bookingForm = this.fb.group({
      customerName: ['', [Validators.required, Validators.minLength(2)]],
      customerPhone: ['', [Validators.required, Validators.pattern(/^[6-9]\d{9}$/)]],  // Indian 10-digit
      serviceId: ['', Validators.required],
      scheduledAt: ['', Validators.required],
      notes: ['']
    });
  }

  ngOnInit(): void {
    this.minDateTime = new Date(new Date().getTime() + 60 * 60 * 1000).toISOString().slice(0, 16);  // 1 hour from now
    this.branchSlug = this.route.snapshot.paramMap.get('branchSlug')!;
    console.log('Branch slug from param:', this.branchSlug);  // Debug: Should log 'baner' etc.
    
    this.loadStaticBranchData();
  }

  private loadStaticBranchData(): void {
    // Static data based on slug for testing different branches
    const staticBranches: { [key: string]: any } = {
      'baner': {
        _id: 'b1',
        name: 'Baner',
        slug: 'baner',
        address: 'Plot No. 123, Baner Road, Baner, Pune, Maharashtra 411045',
        phone: '+91 9876543210',
        rating: 4.8,
        reviewCount: 120,
        openingHours: { from: '9:00 AM', to: '9:00 PM' },
        salonName: 'Glow Salon',
        bannerImage: 'assets/images/sample-banner.jpg'
      },
      'kothrud': {
        _id: 'b2',
        name: 'Kothrud',
        slug: 'kothrud',
        address: 'Shop No. 45, Karve Road, Kothrud, Pune, Maharashtra 411038',
        phone: '+91 9876543211',
        rating: 4.5,
        reviewCount: 85,
        openingHours: { from: '10:00 AM', to: '8:00 PM' },
        salonName: 'Glow Salon',
        bannerImage: 'assets/images/sample-banner-2.jpg'
      },
      'viman-nagar': {
        _id: 'b3',
        name: 'Viman Nagar',
        slug: 'viman-nagar',
        address: 'Unit 2A, Nagar Road, Viman Nagar, Pune, Maharashtra 411014',
        phone: '+91 9876543212',
        rating: 4.7,
        reviewCount: 95,
        openingHours: { from: '9:30 AM', to: '10:00 PM' },
        salonName: 'Glow Salon',
        bannerImage: 'assets/images/sample-banner-3.jpg'
      }
    };

    this.branchData = staticBranches[this.branchSlug] || staticBranches['baner'];  // Default to Baner
    this.locationId = this.branchData._id;
    console.log('Loaded branch data:', this.branchData);  // Debug: Confirms data
    this.loadStaticServices();
  }

  private loadStaticServices(): void {
    // Static services (can vary by branch later)
    this.services = [
      { _id: 's1', name: 'Hair Cut', price: 299, durationMinutes: 30, description: 'Classic haircut for all styles' },
      { _id: 's2', name: 'Beard Trim', price: 199, durationMinutes: 20, description: 'Neat beard shaping' },
      { _id: 's3', name: 'Facial Cleanup', price: 499, durationMinutes: 45, description: 'Deep clean and refresh' },
      { _id: 's4', name: 'Hair Coloring', price: 799, durationMinutes: 60, description: 'Professional color treatment' }
    ];
  }

  selectService(serviceId: string): void {
    this.bookingForm.patchValue({ serviceId });
  }

  submitBooking(): void {
    if (this.bookingForm.valid) {
      const formData = this.bookingForm.value;
      const bookingData = {
        salonId: this.salonId,
        locationId: this.locationId,
        serviceId: formData.serviceId,
        customerName: formData.customerName,
        customerPhone: formData.customerPhone,
        scheduledAt: new Date(formData.scheduledAt),
        status: 'pending',
        notes: formData.notes
      };

      console.log('Static Booking submitted:', bookingData);  // For testing
      alert(`Booking confirmed for ${formData.customerName} on ${this.datePipe.transform(formData.scheduledAt, 'MMM dd, yyyy hh:mm a')}! We'll call you soon.`);
      this.bookingForm.reset();  // Reset form after submit
      // this.router.navigate(['/home']);  // Uncomment for production flow
    }
  }
}