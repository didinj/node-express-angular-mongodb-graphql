import { Component, OnInit } from '@angular/core';
import { Book } from '../../services/book';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-book-list',
  imports: [CommonModule, FormsModule],
  templateUrl: './book-list.html',
  styleUrl: './book-list.css'
})
export class BookList implements OnInit {
  books: any[] = [];

  // Form input bindings
  title = '';
  author = '';
  pages: number | null = null;

  constructor(private bookService: Book) { }

  ngOnInit(): void {
    this.loadBooks();
  }

  loadBooks(): void {
    this.bookService.getBooks().subscribe((result: any) => {
      this.books = result.data.books;
    });
  }

  addBook(): void {
    if (!this.title || !this.author || this.pages === null) return;
    this.bookService.addBook(this.title, this.author, this.pages).subscribe(() => {
      this.title = '';
      this.author = '';
      this.pages = null;
    });
  }

  deleteBook(id: string): void {
    this.bookService.deleteBook(id).subscribe();
  }
}
