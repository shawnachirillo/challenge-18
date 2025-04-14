// server/src/server.ts
import express, { Express } from 'express';
import { ApolloServer } from 'apollo-server-express';
import dotenv from 'dotenv';

import typeDefs from './schema/typeDefs.js';
import { resolvers } from './schema/resolvers.js';
import { connectDB } from './config/connection.js';
import { authMiddleware } from './services/auth.js';

dotenv.config();

const PORT = process.env.PORT || 3002;
const app: Express = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use((req, res, next) => {
  authMiddleware({ req });
  next();
});

async function startServer() {
  await connectDB();

  const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({ req }) => ({ user: (req as any).user }),
  });

  await server.start();
  server.applyMiddleware({ app, path: '/graphql' });

  app.listen(PORT, () => {
    console.log(`🚀 Server ready at http://localhost:${PORT}${server.graphqlPath}`);
  });
}

startServer();
