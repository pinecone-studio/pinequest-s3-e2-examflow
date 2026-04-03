export { gql, type ApolloCache, type OperationVariables } from "@apollo/client";
import * as ApolloReactHooks from "@apollo/client/react";

const { useLazyQuery, useMutation, useQuery } = ApolloReactHooks;
const apolloUseSuspenseQuery = ApolloReactHooks.useSuspenseQuery;
const localSkipToken = {};
const apolloSkipToken =
  "skipToken" in ApolloReactHooks ? ApolloReactHooks.skipToken : localSkipToken;

export { useLazyQuery, useMutation, useQuery };
export type {
  LazyQueryHookOptions,
  MutationHookOptions,
  MutationResult,
  QueryHookOptions,
  QueryResult,
} from "@apollo/client/react";
import type {
  ApolloCache,
  OperationVariables,
} from "@apollo/client";
import type {
  MutationHookOptions,
  useMutation as ApolloUseMutation,
} from "@apollo/client/react";

export type MutationFunction<
  TData = unknown,
  TVariables extends OperationVariables = OperationVariables,
  TCache extends ApolloCache = ApolloCache,
> = ApolloUseMutation.MutationFunction<TData, TVariables, TCache>;

export type BaseMutationOptions<
  TData = unknown,
  TVariables extends OperationVariables = OperationVariables,
  TCache extends ApolloCache = ApolloCache,
> = MutationHookOptions<TData, TVariables, unknown, TCache>;

export type SkipToken = Record<string, never>;
export type SuspenseQueryHookOptions<
  _TData = unknown,
  _TVariables extends OperationVariables = OperationVariables,
> = Record<string, unknown>;
export type UseSuspenseQueryResult<
  TData = unknown,
  _TVariables extends OperationVariables = OperationVariables,
> = { data: TData };

export const skipToken = apolloSkipToken as SkipToken;
export const useSuspenseQuery = ((
  query: unknown,
  options?: SkipToken | SuspenseQueryHookOptions,
) =>
  apolloUseSuspenseQuery(
    query as never,
    options === skipToken && apolloSkipToken === localSkipToken ? undefined : options,
  )) as <
  TData = unknown,
  TVariables extends OperationVariables = OperationVariables,
>(
  query: unknown,
  options?: SkipToken | SuspenseQueryHookOptions<TData, TVariables>,
) => UseSuspenseQueryResult<TData, TVariables>;
