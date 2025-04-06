// import express from 'express';
import path from 'path';
import { ApolloServer } from 'apollo-server-express';
import db from './config/connection.js';
import { typeDefs, resolvers } from './schema/index.js';
import { authMiddleware, signToken } from './services/auth.js';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import express from 'express';
import type { Express } from 'express';

console.log("Server loaded!");

const app: Express = express();


const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);


const PORT = process.env.PORT || 3001;

const startApolloServer = async () => {
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: authMiddleware,
  });

  await server.start();
  app.use(express.urlencoded({ extended: true }));


  app.use(express.urlencoded({ extended: true }));
  app.use(express.json());

  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '../client/build')));
  }

  app.get('*', (_req, res) => {
    res.sendFile(path.join(__dirname, '../client/build/index.html'));
  });

  db.once('open', () => {
    app.listen(PORT, () => {
      console.log(`🚀 Server running at http://localhost:${PORT}${server.graphqlPath}`);
    });
  });
};

startApolloServer();
