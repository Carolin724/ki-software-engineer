import { Injectable, signal } from '@angular/core';
import { Book } from '../books/book';

const FAVORITES_STORAGE_KEY = 'bookmonkey-favorites';
const STORAGE_WARNING = 'Favoriten konnten nicht dauerhaft gespeichert werden';

@Injectable({ providedIn: 'root' })
export class FavoritesService {
  readonly storageWarning = signal<string | null>(null);
  private readonly favoritesState = signal<Book[]>(this.readFavorites());
  private sessionFavorites = this.favoritesState().slice();
  readonly favorites = this.favoritesState.asReadonly();

  isFavorite(bookId: string): boolean {
    return this.favoritesState().some(book => book.id === bookId);
  }

  toggle(book: Book): void {
    const current = this.favoritesState();
    const index = current.findIndex(favorite => favorite.id === book.id);
    const next = index === -1 ? [book, ...current] : current.filter(favorite => favorite.id !== book.id);

    this.sessionFavorites = next.slice();
    this.favoritesState.set(next);
    this.saveFavorites(next);
  }

  private readFavorites(): Book[] {
    try {
      const stored = globalThis.localStorage?.getItem(FAVORITES_STORAGE_KEY);
      if (!stored) {
        return [];
      }

      const favorites = JSON.parse(stored) as unknown;
      return Array.isArray(favorites) ? favorites : [];
    } catch {
      this.storageWarning.set(STORAGE_WARNING);
      return [];
    }
  }

  private saveFavorites(favorites: Book[]): void {
    try {
      globalThis.localStorage?.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(favorites));
      this.storageWarning.set(null);
    } catch {
      this.storageWarning.set(STORAGE_WARNING);
      this.favoritesState.set(this.sessionFavorites);
    }
  }
}
