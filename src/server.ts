import compression from "compression";
import express from "express";
import morgan from "morgan";
import rateLimit from "express-rate-limit";
import http from "http";
import { ApolloServer } from "apollo-server-express";
import { ApolloServerPluginDrainHttpServer } from "apollo-server-core";
import config from "./config";
import { resolvers } from "./graphql/resolvers";
import typeDefs from "./graphql/schema.graphql";
import { MockDataSource } from "./mockdb/mockDataSource";

const startApolloServer = async (typeDefs, resolvers) => {
  const app = express();

  // Middleware
  app.use(rateLimit({
    windowMs: 60 * 100, // 1 minute
    max: 1000
  }));
  app.use(compression());
  app.use(morgan("tiny"));

  const httpServer = http.createServer(app);

  const server = new ApolloServer({
    typeDefs,
    resolvers,
    dataSources: () => {
      return {
        data: new MockDataSource()
      }
    },
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })]
  });

  await server.start();

  server.applyMiddleware({ app });

  await new Promise<void>(resolve => httpServer.listen({ port: config.port }, resolve));

  console.log(`Server listening at ${config.host}:${config.port}${server.graphqlPath}`);
};

startApolloServer(typeDefs, resolvers).then();