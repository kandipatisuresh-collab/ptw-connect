import { createReadStream, existsSync, statSync } from 'node:fs';
import { createServer } from 'node:http';
import { extname, join, normalize } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../frontend/dist', import.meta.url));
const frontendPort = Number(process.env.FRONTEND_PORT ?? 4173);
const backendPort = Number(process.env.BACKEND_PORT ?? 3000);

const contentTypes = {
  '.css': 'text/css; charset=utf-8',
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.map': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
};

function serveStatic(request, response) {
  const pathname = new URL(request.url ?? '/', 'http://localhost').pathname;
  const requestedPath = pathname === '/' ? '/index.html' : pathname;
  const filePath = normalize(join(root, requestedPath));

  if (!filePath.startsWith(root) || !existsSync(filePath) || !statSync(filePath).isFile()) {
    response.writeHead(404, { 'content-type': 'text/plain; charset=utf-8' });
    response.end('Not found');
    return;
  }

  response.writeHead(200, {
    'cache-control': 'no-cache',
    'content-type': contentTypes[extname(filePath)] ?? 'application/octet-stream',
  });
  createReadStream(filePath).pipe(response);
}

function proxyApi(request, response) {
  const backendRequest = fetch(`http://127.0.0.1:${backendPort}${request.url}`, {
    method: request.method,
    headers: request.headers,
    body: ['GET', 'HEAD'].includes(request.method ?? '') ? undefined : request,
    duplex: 'half',
  });

  backendRequest
    .then(async (backendResponse) => {
      response.writeHead(backendResponse.status, Object.fromEntries(backendResponse.headers));
      response.end(Buffer.from(await backendResponse.arrayBuffer()));
    })
    .catch(() => {
      response.writeHead(502, { 'content-type': 'application/json; charset=utf-8' });
      response.end(JSON.stringify({ message: 'Backend service unavailable.' }));
    });
}

createServer((request, response) => {
  if (request.url?.startsWith('/api/')) {
    proxyApi(request, response);
    return;
  }

  serveStatic(request, response);
}).listen(frontendPort, () => {
  process.stdout.write(`PTW frontend listening on http://localhost:${frontendPort}\n`);
});