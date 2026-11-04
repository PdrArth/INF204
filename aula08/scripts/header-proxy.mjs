import http from 'node:http';
import net from 'node:net';

export function createHeaderProxy(port = 8089, targetPort = 8088) {
  const server = http.createServer((request, response) => {
    const upstream = http.request({ hostname: '127.0.0.1', port: targetPort, path: request.url, method: request.method, headers: request.headers }, incoming => {
      response.writeHead(incoming.statusCode, {
        ...incoming.headers,
        'Cross-Origin-Opener-Policy': 'same-origin',
        'Cross-Origin-Embedder-Policy': 'require-corp',
      });
      incoming.pipe(response);
      incoming.on('error', () => response.destroy());
    });
    upstream.on('error', () => { if (!response.headersSent) response.writeHead(503); response.end('Expo iniciando. Tente novamente em instantes.'); });
    request.on('aborted', () => upstream.destroy());
    request.pipe(upstream);
  });

  // Mantem o WebSocket de desenvolvimento e o Fast Refresh atravessando o proxy.
  server.on('upgrade', (request, socket, head) => {
    const upstream = net.connect(targetPort, '127.0.0.1', () => {
      const headers = Object.entries(request.headers).map(([key, value]) => key + ': ' + value).join('\r\n');
      upstream.write(request.method + ' ' + request.url + ' HTTP/' + request.httpVersion + '\r\n' + headers + '\r\n\r\n');
      if (head.length) upstream.write(head);
      socket.pipe(upstream).pipe(socket);
    });
    upstream.on('error', () => socket.destroy());
    socket.on('error', () => upstream.destroy());
    socket.on('close', () => upstream.destroy());
  });

  return new Promise((resolve, reject) => {
    server.once('error', reject);
    server.listen(port, '127.0.0.1', () => resolve(server));
  });
}
