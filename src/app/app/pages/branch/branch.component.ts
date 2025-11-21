import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from 'src/app/core/services/api.service';

@Component({
  selector: 'app-branch',
  templateUrl: './branch.component.html',
  styleUrls: ['./branch.component.scss']
})
export class BranchComponent implements OnInit, OnDestroy {

  branchSlug!: string;

  branchData: any = null;        // branch details
  salonData: any = null;         // salon details
  services: any[] = [];          // list of services under this branch
  minDateTime: string = '';
  bookingForm: FormGroup;
  isLoading: boolean = true;

  // Banner images for branches
  private branchBannerImages: string[] = [
    'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=1600&h=900&fit=crop',
    'https://images.unsplash.com/photo-1562322140-8baeececf3df?w=1600&h=900&fit=crop',
    'https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?w=1600&h=900&fit=crop',
    'https://images.unsplash.com/photo-1633681926022-84c23e8cb2d6?w=1600&h=900&fit=crop',
    'https://images.unsplash.com/photo-1522337660859-02fbefca4702?w=1600&h=900&fit=crop',
    'https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?w=1600&h=900&fit=crop',
    'https://images.unsplash.com/photo-1585747860715-2ba37e788b70?w=1600&h=900&fit=crop',
    'https://images.unsplash.com/photo-1519415510236-718bdfcd89c8?w=1600&h=900&fit=crop'
  ];

  private imageRotationInterval: any;

  constructor(
    private route: ActivatedRoute,
    private api: ApiService,
    private fb: FormBuilder
  ){
     this.bookingForm = this.fb.group({
      customerName: ['', [Validators.required, Validators.minLength(2)]],
      customerPhone: ['', [Validators.required, Validators.pattern(/^[6-9]\d{9}$/)]],
      serviceId: ['', Validators.required],
      scheduledAt: ['', Validators.required],
      notes: ['']
    }); 
  }

  ngOnInit(): void {
    // Set minimum datetime to 1 hour from now
    this.minDateTime = new Date(Date.now() + 60 * 60 * 1000)
      .toISOString()
      .slice(0, 16);
    
    // Get branch slug from route
    this.branchSlug = this.route.snapshot.paramMap.get('branchSlug')!;
    this.loadBranchData();
    
    // Start banner image rotation
    this.startImageRotation();
  }

  ngOnDestroy(): void {
    if (this.imageRotationInterval) {
      clearInterval(this.imageRotationInterval);
    }
  }

  // -----------------------------------------------------
  // Load Branch + Services
  // -----------------------------------------------------
  loadBranchData() {
    this.isLoading = true;
    
    this.api.getBranchBySlug(this.branchSlug).subscribe({
      next: (res: any) => {
        console.log("Branch API Response:", res);

        if (res.success) {
          console.log("Branch Data:", res.data.branch);
          this.branchData = res.data.branch;
          this.salonData = res.data.salon;
          this.services = res.data.services || [];

          // Process branch data
          if (this.branchData) {
            // Assign random banner image if not exists
            if (!this.branchData.bannerImage) {
              this.branchData.bannerImage = this.getRandomBannerImage();
            }

            // Add salon name to branch data
            if (this.salonData && !this.branchData.salonName) {
              this.branchData.salonName = this.salonData.name;
            }

            // Add default rating if not exists
            if (!this.branchData.rating) {
              this.branchData.rating = '4.5';
            }

            // Add default review count if not exists
            if (!this.branchData.reviewCount) {
              this.branchData.reviewCount = 0;
            }

            // Format opening hours
            if (!this.branchData.openingHours) {
              this.branchData.openingHours = {
                from: '9:00 AM',
                to: '9:00 PM'
              };
            }
          }

          console.log("Processed Branch Data:", this.branchData);
          console.log("Services:", this.services);
        } else {
          console.error("API returned success: false");
        }

        this.isLoading = false;
      },
      error: (err) => {
        console.error("Error loading branch:", err);
        this.isLoading = false;
        alert('Error loading branch details. Please try again later.');
      }
    });
  }

  // -----------------------------------------------------
  // Get random banner image
  // -----------------------------------------------------
  private getRandomBannerImage(): string {
    const randomIndex = Math.floor(Math.random() * this.branchBannerImages.length);
    return `${this.branchBannerImages[randomIndex]}&t=${Date.now()}`;
  }

  // -----------------------------------------------------
  // Start automatic banner image rotation
  // -----------------------------------------------------
  private startImageRotation(): void {
    this.imageRotationInterval = setInterval(() => {
      if (this.branchData) {
        this.branchData.bannerImage = this.getRandomBannerImage();
      }
    }, 60000); // Rotate every 60 seconds
  }

  // -----------------------------------------------------
  // Select Service and update form
  // -----------------------------------------------------
  selectService(serviceId: string) {
    console.log("Selected Service:", serviceId);
    this.bookingForm.patchValue({
      serviceId: serviceId
    });
  }

  // -----------------------------------------------------
  // Submit Booking
  // -----------------------------------------------------
  submitBooking() {
    if (this.bookingForm.invalid) {
      console.log("Booking form is invalid");
      // Mark all fields as touched to show validation errors
      Object.keys(this.bookingForm.controls).forEach(key => {
        this.bookingForm.get(key)?.markAsTouched();
      });
      alert('Please fill in all required fields correctly.');
      return;
    }

    const bookingData = {
      ...this.bookingForm.value,
      branchSlug: this.branchSlug,
      branchId: this.branchData._id,
      salonId: this.salonData._id
    };

    console.log("Submitting booking:", bookingData);
    
    // Show success message for now
    alert('🎉 Booking Feature Under Development!\n\n' +
          '✨ Your booking details:\n\n' + 
          `👤 Name: ${bookingData.customerName}\n` +
          `📱 Phone: ${bookingData.customerPhone}\n` +
          `💇 Service: ${this.getSelectedServiceName()}\n` +
          `📅 Date: ${new Date(bookingData.scheduledAt).toLocaleString()}\n\n` +
          `📍 Branch: ${this.branchData.name}\n` +
          `🏢 Salon: ${this.salonData.name}\n\n` +
          'We will implement the booking API soon!');
    
    // Reset form after submission
    this.bookingForm.reset();
  }

  // -----------------------------------------------------
  // Helper: Get selected service name
  // -----------------------------------------------------
  getSelectedServiceName(): string {
    const serviceId = this.bookingForm.get('serviceId')?.value;
    const service = this.services.find(s => s._id === serviceId);
    return service ? service.name : 'Unknown Service';
  }

  // -----------------------------------------------------
  // Helper: Check if branch is currently open
  // -----------------------------------------------------
  isOpen(): boolean {
    if (!this.branchData?.openingHours) return true;
    
    try {
      const now = new Date();
      const currentTime = now.getHours() * 60 + now.getMinutes();
      
      // Parse opening hours (e.g., "9:00 AM" to minutes)
      const parseTime = (timeStr: string): number => {
        const [time, period] = timeStr.split(' ');
        const [hours, minutes] = time.split(':').map(Number);
        let totalMinutes = hours * 60 + minutes;
        
        if (period === 'PM' && hours !== 12) {
          totalMinutes += 12 * 60;
        } else if (period === 'AM' && hours === 12) {
          totalMinutes -= 12 * 60;
        }
        
        return totalMinutes;
      };
      
      const openTime = parseTime(this.branchData.openingHours.from);
      const closeTime = parseTime(this.branchData.openingHours.to);
      
      return currentTime >= openTime && currentTime <= closeTime;
    } catch (error) {
      console.error('Error parsing opening hours:', error);
      return true; // Default to open if parsing fails
    }
  }
}