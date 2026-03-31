const LOCAL_GRAPHQL_ENDPOINT = "http://127.0.0.1:8787/graphql";
const LOCAL_API_HOSTNAMES = new Set(["127.0.0.1", "localhost"]);

const getConfiguredGraphqlEndpoint = (): string => {
  const configuredEndpoint = process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT?.trim();

  if (configuredEndpoint) {
    return configuredEndpoint;
  }

  if (process.env.NODE_ENV === "development") {
    return LOCAL_GRAPHQL_ENDPOINT;
  }

  throw new Error("NEXT_PUBLIC_GRAPHQL_ENDPOINT is not configured.");
};

const shouldUseSameOriginApiProxy = (endpoint: string): boolean => {
  if (process.env.NODE_ENV !== "development" || typeof window === "undefined") {
    return false;
  }

  try {
    const url = new URL(endpoint);
    return url.protocol === "http:" && LOCAL_API_HOSTNAMES.has(url.hostname);
  } catch {
    return false;
  }
};

export const getGraphqlEndpoint = (): string => {
  const endpoint = getConfiguredGraphqlEndpoint();
  return shouldUseSameOriginApiProxy(endpoint) ? "/graphql" : endpoint;
};

export const getApiBaseUrl = (): string => {
  const endpoint = getConfiguredGraphqlEndpoint().trim();

  if (shouldUseSameOriginApiProxy(endpoint)) {
    return "";
  }

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
