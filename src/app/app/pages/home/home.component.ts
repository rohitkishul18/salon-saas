import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/core/services/api.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy {

  salon: any = null;
  branchData: any[] = [];
  stats: any = {
    branchCount: 0,
    serviceCount: 0,
    rating: 0,
    reviewCount: 0
  };

  // Dynamic banner image
  bannerImage: string = '';
  
  // Unsplash collections for different themes
  private bannerImages: string[] = [
    'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=1600&h=900&fit=crop',
    'https://images.unsplash.com/photo-1562322140-8baeececf3df?w=1600&h=900&fit=crop',
    'https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?w=1600&h=900&fit=crop',
    'https://images.unsplash.com/photo-1633681926022-84c23e8cb2d6?w=1600&h=900&fit=crop',
    'https://images.unsplash.com/photo-1522337660859-02fbefca4702?w=1600&h=900&fit=crop',
    'https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?w=1600&h=900&fit=crop'
  ];

  private branchImages: string[] = [
    'https://images.unsplash.com/photo-1585747860715-2ba37e788b70?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1519415510236-718bdfcd89c8?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1516975080664-ed2fc6a32937?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1595476108010-b4d1f102b1b1?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1580618672591-eb180b1a973f?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1492552181161-62217fc3076d?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=800&h=600&fit=crop'
  ];

  private imageRotationInterval: any;

  constructor(
    private router: Router,
    private api: ApiService
  ) {}

  ngOnInit(): void {
    this.rotateBannerImage();
    this.loadHomeData();
    this.startImageRotation();
  }

  ngOnDestroy(): void {
    if (this.imageRotationInterval) {
      clearInterval(this.imageRotationInterval);
    }
  }

  loadHomeData() {
    const slug = environment.salonSlug;

    this.api.getHomeData(slug).subscribe({
      next: (res: any) => {
        if (res.success) {
          console.log("Home API response:", res);

          this.salon = res.data.salon;
          this.branchData = this.assignRandomImages(res.data.branches || []);
          this.stats = res.data.stats || {
            branchCount: 0,
            serviceCount: 0,
            rating: 0,
            reviewCount: 0
          };

          console.log("Branches with images:", this.branchData);
        }
      },
      error: (err) => {
        console.error("Home API error:", err);
        // Set default values on error
        this.branchData = [];
        this.stats = {
          branchCount: 0,
          serviceCount: 0,
          rating: 0,
          reviewCount: 0
        };
      }
    });
  }

  // Assign random images to branches
  private assignRandomImages(branches: any[]): any[] {
    return branches.map(branch => ({
      ...branch,
      bannerImage: this.getRandomImage(this.branchImages)
    }));
  }

  // Get random image from array
  private getRandomImage(images: string[]): string {
    const randomIndex = Math.floor(Math.random() * images.length);
    return `${images[randomIndex]}&t=${Date.now()}`;
  }

  // Rotate banner image
  private rotateBannerImage(): void {
    this.bannerImage = this.getRandomImage(this.bannerImages);
    console.log("Banner image set to:", this.bannerImage);
  }

  // Start automatic image rotation every minute
  private startImageRotation(): void {
    this.imageRotationInterval = setInterval(() => {
      this.rotateBannerImage();
      if (this.branchData && this.branchData.length > 0) {
        this.branchData = this.assignRandomImages(this.branchData);
      }
    }, 60000); // 60000ms = 1 minute
  }

  handleVisitBranch(slug: string): void {
    console.log("Navigating to branch:", slug);
    this.router.navigate(['/branch', slug]);
  }

  scrollToBranches(): void {
    const element = document.getElementById('branches');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }
}