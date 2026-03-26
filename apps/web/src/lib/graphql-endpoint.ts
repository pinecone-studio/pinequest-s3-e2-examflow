const DEFAULT_GRAPHQL_ENDPOINT =
  "https://pinequest-api.b94889340.workers.dev/graphql";

export const getGraphqlEndpoint = (): string => {
  const endpoint = process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT?.trim();

  return endpoint && endpoint.length > 0
    ? endpoint
    : DEFAULT_GRAPHQL_ENDPOINT;
};

export const getApiBaseUrl = (): string => {
  const endpoint = getGraphqlEndpoint().trim();

  try {
    const url = new URL(endpoint);
    url.pathname = url.pathname.replace(/\/graphql\/?$/, "") || "/";
    url.search = "";
    url.hash = "";
    return url.toString().replace(/\/$/, "");
  } catch {
    return endpoint.replace(/\/graphql\/?$/, "");
  }
};
