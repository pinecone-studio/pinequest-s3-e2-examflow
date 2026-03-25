"use client";

import { ApolloProvider } from "@apollo/client/react";
import type { PropsWithChildren } from "react";
import { getApolloClient } from "@/lib/apollo-client";

type ApolloAppProviderProps = PropsWithChildren;

export const ApolloAppProvider = ({
  children,
}: ApolloAppProviderProps) => {
  return <ApolloProvider client={getApolloClient()}>{children}</ApolloProvider>;
};
