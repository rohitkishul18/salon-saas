import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ApiService } from 'src/app/core/services/api.service';

interface Salon {
  name: string;
  description?: string;
  contact: {
    email: string;
    phone: string;
    address?: string;
  };
  settings?: {
    currency: string;
    timezone: string;
  };
}

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {
  currentYear = new Date().getFullYear();
  salon: Salon | null = null;
  isLoading = true;
  error = '';

  constructor(private http: HttpClient,private Apiservice: ApiService) {}

  ngOnInit(): void {
    this.fetchSalonDetails();
  }

  private fetchSalonDetails(): void {
    this.Apiservice.getSalonDetails().subscribe({
      next: (response: any) => {
        // console.log('Salon details response:', response);
        if (response?.success && response?.data) {
          const salon = response.data as Salon;
          this.salon = salon;
          // Ensure contact defaults if missing
          if (!salon.contact) {
            salon.contact = { email: 'support@salonportal.com', phone: '123-456-7890' };
          }
          if (!salon.settings) {
            salon.settings = { currency: 'USD', timezone: 'UTC' };
          }
        } else {
          this.error = response?.message || 'Failed to load salon details';
        }
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error fetching salon:', err);
        this.error = 'Failed to load salon details. Please try again later.';
        this.isLoading = false;
      }
    });
  }
}