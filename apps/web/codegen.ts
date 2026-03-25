import type { CodegenConfig } from "@graphql-codegen/cli";

const config: CodegenConfig = {
  schema: "../api/src/graphql/schema.ts",
  documents: ["src/**/*.graphql"],
  ignoreNoDocuments: false,
  generates: {
    "src/graphql/generated.ts": {
      plugins: [
        "typescript",
        "typescript-operations",
        "typescript-react-apollo",
      ],
      config: {
        withHooks: true,
        withComponent: false,
        withHOC: false,
        reactApolloVersion: 3,
        apolloReactCommonImportFrom: "../lib/apollo-codegen",
        apolloReactHooksImportFrom: "../lib/apollo-codegen",
      },
    },
  },
};

export default config;
