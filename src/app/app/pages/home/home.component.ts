import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Branch } from '../../shared/branch-card/branch-card.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  branchData: Branch[] = [
    {
      _id: 'b1',
      name: 'Baner',
      slug: 'baner',
      salonName: 'Glow Salon',
      address: 'Plot No. 123, Baner Road, Baner, Pune, Maharashtra 411045',
      rating: 4.8,
      reviewCount: 120,
      bannerImage: 'https://images.unsplash.com/photo-1562322140-8baeececf3df?w=800&h=600&fit=crop',
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
      bannerImage: 'https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?w=800&h=600&fit=crop',
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
      bannerImage: 'https://images.unsplash.com/photo-1633681926022-84c23e8cb2d6?w=800&h=600&fit=crop',
      phone: '+91 98765 43212',
      openingHours: { from: '9:30 AM', to: '10:00 PM' }
    }
  ];

  constructor(private router: Router) {}

  ngOnInit(): void {
    // Later: Fetch dynamic data from ApiService.getLocations()
  }

  handleVisitBranch(slug: string): void {
    console.log('Navigating to branch:', slug);
    this.router.navigate(['/branch', slug]);
  }

  scrollToBranches(): void {
    const element = document.getElementById('branches');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }
}