import { ApolloClient, InMemoryCache } from "@apollo/client";

export const client = new ApolloClient({
  uri: "https://clientes.estudioresortera.cl/graphql",
  cache: new InMemoryCache(),
});
