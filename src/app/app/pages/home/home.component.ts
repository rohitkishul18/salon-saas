import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

interface Branch {
  _id: string;
  name: string;
  slug: string; // Added for routing
  salonName: string;
  address: string;
  rating: number;
  reviewCount: number;
  bannerImage: string; // Kept but not used in HTML
  phone: string;
  openingHours: { from: string; to: string };
  // Services removed as per request
}

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  heroBannerImage: string = 'assets/images/main-banner.jpg';


  branchData: Branch[] = [
    {
      _id: 'b1',
      name: 'Baner',
      slug: 'baner',
      salonName: 'Glow Salon',
      address: 'Plot No. 123, Baner Road, Baner, Pune, Maharashtra 411045',
      rating: 4.8,
      reviewCount: 120,
      bannerImage: 'assets/images/sample-banner.jpg', // Not shown
      phone: '+91 98765 43210',
      openingHours: { from: '9:00 AM', to: '9:00 PM' }
    },
    {
      _id: 'b2',
      name: 'Kothrud',
      slug: 'kothrud',
      salonName: 'Glow Salon',
      address: 'Shop No. 45, Karve Road, Kothrud, Pune, Maharashtra 411038',
      rating: 4.5,
      reviewCount: 85,
      bannerImage: 'assets/images/sample-banner-2.jpg', // Not shown
      phone: '+91 98765 43211',
      openingHours: { from: '10:00 AM', to: '8:00 PM' }
    },
    {
      _id: 'b3',
      name: 'Viman Nagar',
      slug: 'viman-nagar',
      salonName: 'Glow Salon',
      address: 'Unit 2A, Nagar Road, Viman Nagar, Pune, Maharashtra 411014',
      rating: 4.7,
      reviewCount: 95,
      bannerImage: 'assets/images/sample-banner-3.jpg', // Not shown
      phone: '+91 98765 43212',
      openingHours: { from: '9:30 AM', to: '10:00 PM' }
    }
  ];

  constructor(private router: Router) {}

  ngOnInit(): void {
    // Later: Fetch dynamic data from ApiService.getLocations()
    // e.g., this.api.getLocations().subscribe(locs => {
    //   this.branchData = locs.map(loc => ({
    //     ...loc,
    //     rating: 4.5, // Aggregate from Reviews
    //     reviewCount: 100 // Count from Reviews
    //   }));
    // });
  }

  visitBranch(slug: string): void {
    console.log('Navigating to branch:', slug);
    this.router.navigate(['/branch', slug]);
  }

}