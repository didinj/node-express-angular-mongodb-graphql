import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Apollo, QueryRef } from 'apollo-angular';
import gql from 'graphql-tag';
import { Book } from '../book';

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

const deleteBook = gql`
  mutation removeBook($id: String!) {
    removeBook(id:$id) {
      _id
    }
  }
`;

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss']
})
export class DetailComponent implements OnInit {

  book: Book = { id: '', isbn: '', title: '', author: '', description: '', publisher: '', publishedYear: null, updatedDate: null };
  isLoadingResults = true;
  resp: any = {};
  private query: QueryRef<any>;

  constructor(private apollo: Apollo, private router: Router, private route: ActivatedRoute) { }

  ngOnInit() {
    this.getBookDetails();
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
      this.isLoadingResults = false;
    });
  }

  deleteBook() {
    this.isLoadingResults = true;
    const bookId = this.route.snapshot.params.id;
    this.apollo.mutate({
      mutation: deleteBook,
      variables: {
        id: bookId
      }
    }).subscribe(({ data }) => {
      console.log('got data', data);
      this.isLoadingResults = false;
      this.router.navigate(['/books']);
    }, (error) => {
      console.log('there was an error sending the query', error);
      this.isLoadingResults = false;
    });
  }

}
