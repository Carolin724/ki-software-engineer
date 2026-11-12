import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FavoritesService } from '../shared/favorites.service';
import { BookItemComponent } from './book-item.component';

@Component({
  selector: 'app-favorites',
  standalone: true,
  imports: [CommonModule, RouterModule, BookItemComponent],
  template: `
    <div class="container mx-auto max-w-7xl px-4 py-12">
      <h1 class="mb-10 border-b border-gray-200 pb-4 text-3xl font-bold text-blue-700">Favoriten</h1>
      <div *ngIf="favorites.length; else empty" class="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5">
        <app-book-item *ngFor="let book of favorites; trackBy: trackById" [book]="book"></app-book-item>
      </div>
      <ng-template #empty>
        <div class="rounded-xl bg-gray-50 py-16 text-center">
          <p class="text-xl font-medium text-gray-600">Noch keine Favoriten</p>
        </div>
      </ng-template>
    </div>
  `
})
export class FavoritesComponent {
  constructor(private readonly favoritesService: FavoritesService) {}

  get favorites() {
    return this.favoritesService.favorites();
  }

  trackById(index: number, book: { id: string }): string {
    return book.id;
  }
}
