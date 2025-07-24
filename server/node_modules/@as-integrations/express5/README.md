# Apollo Server Integration for Express v5

## **Introduction**

This package integrates Apollo Server v4 with version 5 of the Express web framework, by exporting a middleware that executes GraphQL operations.

It is identical to the middleware exported at `@apollo/server/express5` from the core `@apollo/server` v4 package, updated to support Express v5 instead of Express v4.

## **Requirements**

- **[Node.js v20](https://nodejs.org/)** or later
- **[Express v5](https://expressjs.com/)**; see `@as-integrations/express4` for Express v4 support
- **[Apollo Server v4](https://www.apollographql.com/docs/apollo-server/)**

## **Installation**

```bash
npm install @apollo/server graphql express@5 @as-integrations/express5 cors
```

## **Usage**

Set up [Express](https://expressjs.com/) & [Apollo Server](https://www.apollographql.com/docs/apollo-server/) like you usually would, and then connect the two by using the `expressMiddleware` middleware:

```typescript
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@as-integrations/express5';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import express from 'express';
import http from 'http';
import cors from 'cors';
import { typeDefs, resolvers } from './schema';

interface MyContext {
  token?: string;
}

// Required logic for integrating with Express
const app = express();
// Our httpServer handles incoming requests to our Express app.
// Below, we tell Apollo Server to "drain" this httpServer,
// enabling our servers to shut down gracefully.
const httpServer = http.createServer(app);

const server = new ApolloServer<MyContext>({
  typeDefs,
  resolvers,
  plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
});
// Ensure we wait for our server to start
await server.start();

// Set up our Express middleware to handle CORS, body parsing,
// and our expressMiddleware function.
app.use(
  '/',
  cors<cors.CorsRequest>(),
  express.json(),
  // expressMiddleware accepts the same arguments:
  // an Apollo Server instance and optional configuration options
  expressMiddleware(server, {
    context: async ({ req }) => ({ token: req.headers.token }),
  }),
);

await new Promise<void>((resolve) =>
  httpServer.listen({ port: 4000 }, resolve),
);
console.log(`🚀 Server ready at http://localhost:4000/`);
```

Note: **You must call and await `server.start()` before using the integration.**
