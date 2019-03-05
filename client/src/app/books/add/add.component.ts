import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';

const submitBook = gql`
  mutation addBook(
    $isbn: String!,
    $title: String!,
    $author: String!,
    $description: String!,
    $publisher: String!,
    $published_year: Int!) {
    addBook(
      isbn: $isbn,
      title: $title,
      author: $author,
      description: $description,
      publisher: $publisher,
      published_year: $published_year) {
      _id
    }
  }
`;

@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.scss']
})
export class AddComponent implements OnInit {

  book: any = { isbn: '', title: '', author: '', description: '', publisher: '', publishedYear: null, updatedDate: null };
  isLoadingResults = false;
  resp: any = {};
  bookForm: FormGroup;
  isbn = '';
  title = '';
  author = '';
  description = '';
  publisher = '';
  publishedYear: number = null;

  constructor(
    private apollo: Apollo,
    private router: Router,
    private formBuilder: FormBuilder
  ) { }

  ngOnInit() {
    this.bookForm = this.formBuilder.group({
      isbn : [null, Validators.required],
      title : [null, Validators.required],
      author : [null, Validators.required],
      description : [null, Validators.required],
      publisher : [null, Validators.required],
      publishedYear : [null, Validators.required]
    });
  }

  get f() {
    return this.bookForm.controls;
  }

  onSubmit(form: NgForm) {
    this.isLoadingResults = true;
    const bookData = form.value;
    this.apollo.mutate({
      mutation: submitBook,
      variables: {
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
      this.router.navigate(['/books/detail/', data.addBook._id]);
    }, (error) => {
      console.log('there was an error sending the query', error);
      this.isLoadingResults = false;
    });
  }

}
