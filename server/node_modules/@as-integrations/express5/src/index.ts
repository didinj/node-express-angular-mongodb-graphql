import type { WithRequired } from '@apollo/utils.withrequired';
import type express from 'express';
import type {
  ApolloServer,
  BaseContext,
  ContextFunction,
  HTTPGraphQLRequest,
} from '@apollo/server';
import { parse as urlParse } from 'url';
import { HeaderMap } from '@apollo/server';

export interface ExpressContextFunctionArgument {
  req: express.Request;
  res: express.Response;
}

export interface ExpressMiddlewareOptions<TContext extends BaseContext> {
  context?: ContextFunction<[ExpressContextFunctionArgument], TContext>;
}

export function expressMiddleware(
  server: ApolloServer<BaseContext>,
  options?: ExpressMiddlewareOptions<BaseContext>,
): express.RequestHandler;
export function expressMiddleware<TContext extends BaseContext>(
  server: ApolloServer<TContext>,
  options: WithRequired<ExpressMiddlewareOptions<TContext>, 'context'>,
): express.RequestHandler;
export function expressMiddleware<TContext extends BaseContext>(
  server: ApolloServer<TContext>,
  options?: ExpressMiddlewareOptions<TContext>,
): express.RequestHandler {
  server.assertStarted('expressMiddleware()');

  // This `any` is safe because the overload above shows that context can
  // only be left out if you're using BaseContext as your context, and {} is a
  // valid BaseContext.
  const defaultContext: ContextFunction<
    [ExpressContextFunctionArgument],
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    any
    // eslint-disable-next-line @typescript-eslint/require-await
  > = async () => ({});

  const context: ContextFunction<[ExpressContextFunctionArgument], TContext> =
    options?.context ?? defaultContext;

  return async (req, res) => {
    if (!('body' in req)) {
      // The json body-parser *always* initializes the `body` field on requests
      // when it runs.  (body-parser@1 (included in Express v4 as
      // `express.json()`) sets it to `{}` by default, and body-parser@2
      // (included in Express v5 as `express.json()`) sets to to `undefined` by
      // default.)
      //
      // So if the field is *completely* missing (not merely set to undefined,
      // but actually not there), you probably forgot to set up body-parser. We
      // send a nice error in this case to help with debugging.
      res.status(500);
      res.send(
        '`req.body` is not set; this probably means you forgot to set up the ' +
          '`json` middleware before the Apollo Server middleware.',
      );
      return;
    }

    const headers = new HeaderMap();
    for (const [key, value] of Object.entries(req.headers)) {
      if (value !== undefined) {
        // Node/Express headers can be an array or a single value. We join
        // multi-valued headers with `, ` just like the Fetch API's `Headers`
        // does. We assume that keys are already lower-cased (as per the Node
        // docs on IncomingMessage.headers) and so we don't bother to lower-case
        // them or combine across multiple keys that would lower-case to the
        // same value.
        headers.set(key, Array.isArray(value) ? value.join(', ') : value);
      }
    }

    const httpGraphQLRequest: HTTPGraphQLRequest = {
      method: req.method.toUpperCase(),
      headers,
      search: urlParse(req.url).search ?? '',
      body: req.body,
    };

    const httpGraphQLResponse = await server.executeHTTPGraphQLRequest({
      httpGraphQLRequest,
      context: () => context({ req, res }),
    });

    for (const [key, value] of httpGraphQLResponse.headers) {
      res.setHeader(key, value);
    }
    res.statusCode = httpGraphQLResponse.status || 200;

    if (httpGraphQLResponse.body.kind === 'complete') {
      res.send(httpGraphQLResponse.body.string);
      return;
    }

    for await (const chunk of httpGraphQLResponse.body.asyncIterator) {
      res.write(chunk);
      // Express/Node doesn't define a way of saying "it's time to send this
      // data over the wire"... but the popular `compression` middleware
      // (which implements `accept-encoding: gzip` and friends) does, by
      // monkey-patching a `flush` method onto the response. So we call it
      // if it's there.
      // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-member-access
      if (typeof (res as any).flush === 'function') {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
        (res as any).flush();
      }
    }
    res.end();
  };
}
