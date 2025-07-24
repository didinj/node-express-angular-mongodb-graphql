import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@as-integrations/express5';
import { typeDefs, resolvers } from './schema/schema.js';
import pkg from 'body-parser';
const { json } = pkg;

const app = express();
const PORT = process.env.PORT || 4000;

// Connect to MongoDB
await mongoose.connect('mongodb://localhost:27017/books', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});
console.log('✅ Connected to MongoDB');

// Create Apollo Server
const server = new ApolloServer({
  typeDefs,
  resolvers
});
await server.start();

// Middleware
app.use(cors());
app.use(json()); // bodyParser is now built-in in modern Express
app.use('/graphql', expressMiddleware(server, {
  context: async ({ req }) => ({ token: req.headers.authorization })
}));

app.listen(PORT, () => {
  console.log(`🚀 Server ready at http://localhost:${PORT}/graphql`);
});
