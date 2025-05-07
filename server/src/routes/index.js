import express from 'express';
const app = express();
const router = express.Router();
import typeDefs from '../schema/typeDefs.js';
import resolvers from '../schema/resolvers.js';
export { typeDefs, resolvers };
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
import apiRoutes from './api/index.js';
router.use('/api', apiRoutes);
app.use(express.json());
// serve up react front-end in production
router.use((_req, res) => {
    res.sendFile(path.join(__dirname, '../../client/build/index.html'));
});
export default router;
