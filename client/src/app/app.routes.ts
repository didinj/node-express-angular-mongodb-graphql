import { Routes } from '@angular/router';
import { BookList } from './components/book-list/book-list';
import { BookAdd } from './components/book-add/book-add';

const routes: Routes = [
  { path: '', redirectTo: '/books', pathMatch: 'full' },
  { path: 'books', component: BookList },
  { path: 'add-book', component: BookAdd },
];
