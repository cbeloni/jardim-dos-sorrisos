import http from 'node:http';
import { createClient } from 'redis';

const PORT = Number(process.env.PORT || 3000);
const REDIS_HOST = process.env.REDIS_HOST || 'redis.default.svc.cluster.local';
const configuredRedisPort = Number.parseInt(process.env.REDIS_PORT, 10);
const REDIS_PORT = Number.isInteger(configuredRedisPort) && configuredRedisPort > 0
  ? configuredRedisPort
  : 6379;
const REDIS_URL = process.env.REDIS_URL || `redis://${REDIS_HOST}:${REDIS_PORT}`;
const ANIMALS = ['pipo', 'mimi', 'toto'];
const redis = createClient({ url: REDIS_URL });

redis.on('error', (error) => console.error('[jardim] Redis:', error.message));

function json(response, statusCode, body) {
  response.writeHead(statusCode, {
    'Content-Type': 'application/json; charset=utf-8',
    'Cache-Control': 'no-store',
  });
  response.end(JSON.stringify(body));
}

function countKey(animalId) {
  return `jardim-dos-sorrisos:animal-clicks:${animalId}`;
}

async function handleRequest(request, response) {
  const url = new URL(request.url, `http://${request.headers.host || 'localhost'}`);

  if (request.method === 'GET' && url.pathname === '/health') {
    return json(response, 200, { status: 'ok' });
  }

  if (request.method === 'GET' && url.pathname === '/api/animals/counts') {
    const values = await redis.mGet(ANIMALS.map(countKey));
    const counts = Object.fromEntries(ANIMALS.map((animalId, index) => [animalId, Number(values[index] || 0)]));
    return json(response, 200, counts);
  }

  const clickMatch = url.pathname.match(/^\/api\/animals\/([a-z]+)\/click$/);
  if (request.method === 'POST' && clickMatch) {
    const [, animalId] = clickMatch;
    if (!ANIMALS.includes(animalId)) return json(response, 404, { error: 'Bichinho não encontrado.' });
    const count = await redis.incr(countKey(animalId));
    return json(response, 200, { animalId, count });
  }

  return json(response, 404, { error: 'Rota não encontrada.' });
}

const server = http.createServer((request, response) => {
  handleRequest(request, response).catch((error) => {
    console.error('[jardim] Erro na API:', error.message);
    json(response, 503, { error: 'Contador indisponível.' });
  });
});

async function start() {
  await redis.connect();
  server.listen(PORT, '0.0.0.0', () => console.log(`[jardim] API ouvindo na porta ${PORT}`));
}

start().catch((error) => {
  console.error('[jardim] Não foi possível conectar ao Redis:', error.message);
  process.exitCode = 1;
});
