import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-branch',
  templateUrl: './branch.component.html',
  styleUrls: ['./branch.component.scss']
})
export class BranchComponent implements OnInit {
  branchSlug!: string;
  branchData: any = null;
  services: any[] = [];
  minDateTime: string = '';

  bookingForm: FormGroup;

  private salonId: string = 'static-salon-id';
  private locationId: string = 'static-location-id';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private datePipe: DatePipe
  ) {
    this.bookingForm = this.fb.group({
      customerName: ['', [Validators.required, Validators.minLength(2)]],
      customerPhone: ['', [Validators.required, Validators.pattern(/^[6-9]\d{9}$/)]],
      serviceId: ['', Validators.required],
      scheduledAt: ['', Validators.required],
      notes: ['']
    });
  }

  ngOnInit(): void {
    this.minDateTime = new Date(new Date().getTime() + 60 * 60 * 1000).toISOString().slice(0, 16);
    this.branchSlug = this.route.snapshot.paramMap.get('branchSlug')!;
    this.loadStaticBranchData();
  }

  private loadStaticBranchData(): void {
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
        bannerImage: 'https://images.unsplash.com/photo-1562322140-8baeececf3df?w=1600&h=600&fit=crop'
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
        bannerImage: 'https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?w=1600&h=600&fit=crop'
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
        bannerImage: 'https://images.unsplash.com/photo-1633681926022-84c23e8cb2d6?w=1600&h=600&fit=crop'
      }
    };

    this.branchData = staticBranches[this.branchSlug] || staticBranches['baner'];
    this.locationId = this.branchData._id;
    this.loadStaticServices();
  }

  private loadStaticServices(): void {
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

      console.log('Static Booking submitted:', bookingData);
      alert(`Booking confirmed for ${formData.customerName} on ${this.datePipe.transform(formData.scheduledAt, 'MMM dd, yyyy hh:mm a')}! We'll call you soon.`);
      this.bookingForm.reset();
    }
  }
}