import { createYoga } from '@graphql-yoga/common';

// Define your GraphQL schema
const typeDefs = `
  type Query {
    hello: String
    health: HealthStatus
  }

  type HealthStatus {
    ok: Boolean
    service: String
    port: Int
  }
`;

// Define resolvers
const resolvers = {
  Query: {
    hello: () => 'Hello from the Pinequest API with GraphQL!',
    health: () => ({
      ok: true,
      service: 'api',
      port: 8787, // Default Cloudflare Workers port
    }),
  },
};

// Create Yoga instance
const yoga = createYoga({
  schema: {
    typeDefs,
    resolvers,
  },
});

// Export the fetch handler for Cloudflare Workers
export default {
  fetch: yoga.fetch,
};
