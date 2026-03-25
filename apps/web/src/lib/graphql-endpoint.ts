const DEFAULT_GRAPHQL_ENDPOINT = "http://127.0.0.1:8787/graphql";

export const getGraphqlEndpoint = (): string => {
  const endpoint = process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT;

  return endpoint && endpoint.length > 0
    ? endpoint
    : DEFAULT_GRAPHQL_ENDPOINT;
};
