import { ApolloClient, HttpLink, InMemoryCache } from "@apollo/client";
import { getGraphqlEndpoint } from "./graphql-endpoint";

let browserApolloClient: ApolloClient | undefined;

const createApolloClient = (): ApolloClient =>
  new ApolloClient({
    cache: new InMemoryCache(),
    link: new HttpLink({
      uri: getGraphqlEndpoint(),
      fetchOptions: {
        cache: "no-store",
      },
    }),
  });

export const getApolloClient = (): ApolloClient => {
  if (typeof window === "undefined") {
    return createApolloClient();
  }

  browserApolloClient ??= createApolloClient();

  return browserApolloClient;
};
