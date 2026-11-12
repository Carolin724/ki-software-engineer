import { Routes } from '@angular/router';
import { BookListComponent } from './books/book-list.component';
import { BookDetailComponent } from './books/book-detail.component';
import { FavoritesComponent } from './books/favorites.component';

export const routes: Routes = [
  { path: '', component: BookListComponent },
  { path: 'favoriten', component: FavoritesComponent },
  { path: 'books/:isbn', component: BookDetailComponent },
  { path: '**', redirectTo: '' }
];
