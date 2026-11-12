import { CommonModule } from '@angular/common';
import { Component, DestroyRef, OnInit, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { finalize, switchMap } from 'rxjs';
import { FavoritesService } from '../shared/favorites.service';
import { Book } from './book';
import { BookApiClient } from './book-api-client.service';

@Component({
  selector: 'app-book-detail',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="container mx-auto max-w-5xl px-4 py-12">
      <a routerLink="/" class="mb-8 inline-block text-blue-700 hover:underline">← Zur Bücherliste</a>

      <div *ngIf="loading" class="py-20 text-center text-gray-600">Buch wird geladen …</div>
      <div *ngIf="error" class="rounded-xl bg-red-50 p-6 text-red-800" role="alert">
        {{ error }}
      </div>

      <article *ngIf="book && !loading" class="grid gap-8 rounded-xl bg-white p-6 shadow-md md:grid-cols-[16rem_1fr]">
        <div>
          <img *ngIf="book.cover" [src]="book.cover" [alt]="book.title" class="w-full object-contain bg-gray-100" />
          <div *ngIf="!book.cover" class="flex aspect-[3/4] items-center justify-center bg-gray-100 text-gray-500">Kein Cover verfügbar</div>
        </div>
        <div>
          <div class="flex items-start justify-between gap-4">
            <div>
              <h1 class="text-3xl font-bold text-blue-700">{{ book.title }}</h1>
              <p *ngIf="book.subtitle" class="mt-2 text-lg text-gray-600">{{ book.subtitle }}</p>
            </div>
            <button
              type="button"
              (click)="toggleFavorite()"
              [attr.aria-label]="favoriteLabel"
              [attr.aria-pressed]="isFavorite"
              class="shrink-0 text-3xl leading-none text-yellow-500"
            >{{ isFavorite ? '★' : '☆' }}</button>
          </div>
          <p class="mt-5 text-lg text-gray-700">{{ book.author }}</p>
          <p class="mt-6 whitespace-pre-line text-gray-700">{{ book.abstract }}</p>
          <p *ngIf="book.isbn" class="mt-6 text-sm text-gray-500">ISBN: {{ book.isbn }}</p>
        </div>
      </article>
    </div>
  `
})
export class BookDetailComponent implements OnInit {
  book: Book | null = null;
  loading = true;
  error: string | null = null;
  private readonly destroyRef = inject(DestroyRef);

  constructor(
    private readonly route: ActivatedRoute,
    private readonly bookApiClient: BookApiClient,
    private readonly favoritesService: FavoritesService
  ) {}

  get isFavorite(): boolean {
    return this.book ? this.favoritesService.isFavorite(this.book.id) : false;
  }

  get favoriteLabel(): string {
    return this.isFavorite ? 'Aus Favoriten entfernen' : 'Zu Favoriten hinzufügen';
  }

  ngOnInit(): void {
    this.route.paramMap
      .pipe(
        switchMap(params => {
          this.loading = true;
          this.error = null;
          this.book = null;
          return this.bookApiClient.getBook(params.get('isbn') ?? '').pipe(finalize(() => (this.loading = false)));
        }),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe({
        next: book => (this.book = book),
        error: () => (this.error = 'Das Buch konnte nicht geladen werden.')
      });
  }

  toggleFavorite(): void {
    if (this.book) {
      this.favoritesService.toggle(this.book);
    }
  }
}
