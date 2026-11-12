import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Book } from './book';
import { FavoritesService } from '../shared/favorites.service';

@Component({
  selector: 'app-book-item',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div
      class="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 flex flex-col h-full"
    >
      <div class="relative aspect-[3/4] overflow-hidden">
        <img
          *ngIf="book.cover"
          [src]="book.cover"
          [alt]="book.title"
          class="w-full h-full object-contain bg-gray-100"
        />
        <div *ngIf="!book.cover" class="w-full h-full bg-gray-100 flex items-center justify-center">
          <span class="text-gray-500 text-sm font-medium">Kein Cover verfügbar</span>
        </div>
        <button
          type="button"
          (click)="toggleFavorite($event)"
          [attr.aria-label]="favoriteLabel"
          [attr.aria-pressed]="isFavorite"
          class="absolute right-3 top-3 rounded-full bg-white/90 px-2 text-3xl leading-none text-yellow-500 shadow"
        >{{ isFavorite ? '★' : '☆' }}</button>
      </div>
      <div class="p-5 flex flex-col flex-grow">
        <h2 class="text-lg font-semibold text-gray-800 mb-1 line-clamp-2"><a [routerLink]="['/books', book.isbn]" class="hover:text-blue-700 hover:underline">{{ book.title }}</a></h2>
        <p *ngIf="book.subtitle" class="text-sm text-gray-600 mb-2 line-clamp-2">{{ book.subtitle }}</p>
        <div class="text-sm text-gray-700 mt-auto">
          <p>
            <span class="text-blue-700">{{ book.author }}</span>
          </p>
          <p *ngIf="book.isbn" class="text-xs text-gray-500 mt-2">ISBN: {{ book.isbn }}</p>
        </div>
      </div>
    </div>
  `
})
export class BookItemComponent {
  @Input() book!: Book;

  constructor(private readonly favoritesService: FavoritesService) {}

  get isFavorite(): boolean {
    return this.favoritesService.isFavorite(this.book.id);
  }

  get favoriteLabel(): string {
    return this.isFavorite ? 'Aus Favoriten entfernen' : 'Zu Favoriten hinzufügen';
  }

  toggleFavorite(event: Event): void {
    event.stopPropagation();
    this.favoritesService.toggle(this.book);
  }

  // No longer needed as we have a single author field
}
