import gql from "graphql-tag";
import Book from "../models/Book.js";

export const typeDefs = gql`
  type Book {
    id: ID!
    title: String
    author: String
    pages: Int
  }

  type Query {
    books: [Book]
    book(id: ID!): Book
  }

  type Mutation {
    addBook(title: String!, author: String!, pages: Int!): Book
    deleteBook(id: ID!): Book
  }
`;

export const resolvers = {
  Query: {
    books: async () => await Book.find(),
    book: (_, { id }) => Book.findById(id)
  },
  Mutation: {
    addBook: (_, { title, author, pages }) =>
      Book.create({ title, author, pages }),
    deleteBook: (_, { id }) => Book.findByIdAndDelete(id)
  }
};
