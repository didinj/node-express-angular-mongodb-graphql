import { Component } from '@angular/core';
import { Book } from '../../services/book';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-book-add',
  imports: [FormsModule],
  templateUrl: './book-add.html',
  styleUrl: './book-add.css'
})
export class BookAdd {
  title = '';
  author = '';
  pages: number | null = null;

  constructor(private bookService: Book, private router: Router) { }

  addBook(): void {
    if (!this.title || !this.author || this.pages === null) return;
    this.bookService.addBook(this.title, this.author, this.pages).subscribe(() => {
      this.router.navigate(['/books']);
    });
  }
}
