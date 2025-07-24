import { Injectable } from '@angular/core';
import { Apollo, gql } from 'apollo-angular';
import { Observable } from 'rxjs';

const GET_BOOKS = gql`
  query {
    books {
      id
      title
      author
      pages
    }
  }
`;

const ADD_BOOK = gql`
  mutation AddBook($title: String!, $author: String!, $pages: Int!) {
    addBook(title: $title, author: $author, pages: $pages) {
      id
      title
      author
      pages
    }
  }
`;

const DELETE_BOOK = gql`
  mutation DeleteBook($id: ID!) {
    deleteBook(id: $id) {
      id
    }
  }
`;

@Injectable({
  providedIn: 'root'
})
export class Book {
  constructor(private apollo: Apollo) { }

  getBooks(): Observable<any> {
    return this.apollo.watchQuery({ query: GET_BOOKS }).valueChanges;
  }

  addBook(title: string, author: string, pages: number): Observable<any> {
    return this.apollo.mutate({
      mutation: ADD_BOOK,
      variables: { title, author, pages },
      refetchQueries: [{ query: GET_BOOKS }],
    });
  }

  deleteBook(id: string): Observable<any> {
    return this.apollo.mutate({
      mutation: DELETE_BOOK,
      variables: { id },
      refetchQueries: [{ query: GET_BOOKS }],
    });
  }
}
