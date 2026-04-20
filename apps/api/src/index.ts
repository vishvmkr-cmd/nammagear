import 'dotenv/config';
import { createServer } from './server.js';

if (!process.env.JWT_SECRET?.trim()) {
  console.error('[api] Missing JWT_SECRET in environment. Copy apps/api/.env.example to apps/api/.env and set JWT_SECRET.');
  process.exit(1);
}
if (!process.env.DATABASE_URL?.trim()) {
  console.error('[api] Missing DATABASE_URL. Copy apps/api/.env.example to apps/api/.env and point it at your PostgreSQL database.');
  process.exit(1);
}

const port = Number(process.env.PORT) || 4000;
const app = createServer();

app.listen(port, () => {
  console.log(`[api] listening on :${port}`);
});
