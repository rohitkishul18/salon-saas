import { Component, Input, Output, EventEmitter } from '@angular/core';

export interface Branch {
  _id: string;
  name: string;
  slug: string;
  salonName: string;
  address: string;
  rating: number;
  reviewCount: number;
  bannerImage: string;
  phone: string;
  openingHours: { from: string; to: string };
}

@Component({
  selector: 'app-branch-card',
  templateUrl: './branch-card.component.html',
  styleUrls: ['./branch-card.component.scss']
})
export class BranchCardComponent {
  @Input() branch!: Branch;
  @Output() visitBranchClick = new EventEmitter<string>();

  onVisitBranch(): void {
    this.visitBranchClick.emit(this.branch.slug);
  }
}