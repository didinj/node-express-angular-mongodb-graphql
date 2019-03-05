import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { Apollo, QueryRef } from 'apollo-angular';
import gql from 'graphql-tag';

const bookQuery = gql`
  query book($bookId: String) {
    book(id: $bookId) {
      _id
      isbn
      title
      author
      description
      published_year
      publisher
      updated_date
    }
  }
`;

const submitBook = gql`
  mutation updateBook(
    $id: String!,
    $isbn: String!,
    $title: String!,
    $author: String!,
    $description: String!,
    $publisher: String!,
    $published_year: Int!) {
    updateBook(
      id: $id,
      isbn: $isbn,
      title: $title,
      author: $author,
      description: $description,
      publisher: $publisher,
      published_year: $published_year) {
      updated_date
    }
  }
`;

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss']
})
export class EditComponent implements OnInit {

  book: any = { _id: '', isbn: '', title: '', author: '', description: '', publisher: '', publishedYear: null, updatedDate: null };
  isLoadingResults = true;
  resp: any = {};
  private query: QueryRef<any>;
  bookForm: FormGroup;
  id = '';
  isbn = '';
  title = '';
  author = '';
  description = '';
  publisher = '';
  publishedYear: number = null;

  constructor(
    private apollo: Apollo,
    private route: ActivatedRoute,
    private router: Router,
    private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.bookForm = this.formBuilder.group({
      isbn : [null, Validators.required],
      title : [null, Validators.required],
      author : [null, Validators.required],
      description : [null, Validators.required],
      publisher : [null, Validators.required],
      publishedYear : [null, Validators.required]
    });
    this.getBookDetails();
  }

  get f() {
    return this.bookForm.controls;
  }

  getBookDetails() {
    const id = this.route.snapshot.params.id;
    this.query = this.apollo.watchQuery({
      query: bookQuery,
      variables: { bookId: id }
    });

    this.query.valueChanges.subscribe(res => {
      this.book = res.data.book;
      console.log(this.book);
      this.id = this.book._id;
      this.isLoadingResults = false;
      this.bookForm.setValue({
        isbn: this.book.isbn,
        title: this.book.title,
        author: this.book.author,
        description: this.book.description,
        publisher: this.book.publisher,
        publishedYear: this.book.published_year
      });
    });
  }

  onSubmit(form: NgForm) {
    this.isLoadingResults = true;
    console.log(this.id);
    const bookData = form.value;
    this.apollo.mutate({
      mutation: submitBook,
      variables: {
        id: this.id,
        isbn: bookData.isbn,
        title: bookData.title,
        author: bookData.author,
        description: bookData.description,
        publisher: bookData.publisher,
        published_year: bookData.publishedYear
      }
    }).subscribe(({ data }) => {
      console.log('got data', data);
      this.isLoadingResults = false;
    }, (error) => {
      console.log('there was an error sending the query', error);
      this.isLoadingResults = false;
    });
  }

  bookDetails() {
    this.router.navigate(['/books/detail/', this.id]);
  }

}
