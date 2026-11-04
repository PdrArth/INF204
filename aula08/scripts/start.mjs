import { spawn } from 'node:child_process';
import { createHash } from 'node:crypto';
import { existsSync } from 'node:fs';
import { mkdir, writeFile } from 'node:fs/promises';
import net from 'node:net';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import QRCode from 'qrcode';
import { createHeaderProxy } from './header-proxy.mjs';

const root = fileURLToPath(new URL('..', import.meta.url));
const localOnly = process.argv.includes('--local');
const children = [];
let proxy;
let stopping = false;

function stop(code = 0) {
  if (stopping) return;
  stopping = true;
  for (const child of children) child.kill();
  proxy?.closeAllConnections();
  proxy?.close();
  process.exit(code);
}
process.on('SIGINT', () => stop());
process.on('SIGTERM', () => stop());

async function ensureMetroPortFree() {
  const test = net.createServer();
  await new Promise((done, reject) => {
    test.once('error', () => reject(new Error('A porta 8088 ja esta ocupada. Feche a outra instancia da Pratica 08.')));
    test.listen(8088, '127.0.0.1', done);
  });
  await new Promise(done => test.close(done));
}

async function cloudflaredPath() {
  if (process.env.CLOUDFLARED_PATH) return process.env.CLOUDFLARED_PATH;
  if (process.platform !== 'win32' || process.arch !== 'x64') {
    throw new Error('Informe CLOUDFLARED_PATH para seu executavel cloudflared ou use npm run start:ngrok.');
  }
  const binary = resolve(root, '.cache', 'cloudflared.exe');
  if (existsSync(binary)) return binary;
  console.log('Baixando cloudflared oficial (somente na primeira execucao)...');
  const releaseResponse = await fetch('https://api.github.com/repos/cloudflare/cloudflared/releases/latest', { headers: { 'User-Agent': 'INF204-Pratica08' }, signal: AbortSignal.timeout(20000) });
  if (!releaseResponse.ok) throw new Error('Nao foi possivel consultar a versao oficial do cloudflared.');
  const release = await releaseResponse.json();
  const asset = release.assets.find(item => item.name === 'cloudflared-windows-amd64.exe');
  if (!asset) throw new Error('Executavel cloudflared nao encontrado na versao oficial.');
  const response = await fetch(asset.browser_download_url, { signal: AbortSignal.timeout(60000) });
  if (!response.ok) throw new Error('Falha ao baixar cloudflared.');
  const bytes = Buffer.from(await response.arrayBuffer());
  const digest = 'sha256:' + createHash('sha256').update(bytes).digest('hex');
  if (!asset.digest || asset.digest !== digest) throw new Error('O hash do executavel oficial nao confere.');
  await mkdir(resolve(root, '.cache'), { recursive: true });
  await writeFile(binary, bytes);
  return binary;
}

async function openTunnel() {
  const binary = await cloudflaredPath();
  console.log('Conectando tunel publico...');
  return new Promise((done, reject) => {
    const child = spawn(binary, ['tunnel', '--no-autoupdate', '--url', 'http://127.0.0.1:8089', '--protocol', 'http2'], { windowsHide: true, stdio: ['ignore', 'pipe', 'pipe'] });
    children.push(child);
    let found = false;
    let output = '';
    const timeout = setTimeout(() => reject(new Error('O tunel nao conectou. Confira sua internet ou tente npm run start:ngrok.')), 60000);
    function parse(chunk) {
      output = (output + chunk.toString()).slice(-16000);
      const match = output.match(/https:\/\/[a-z0-9-]+\.trycloudflare\.com/);
      if (match && !found) { found = true; clearTimeout(timeout); done(match[0]); }
    }
    child.stdout.on('data', parse);
    child.stderr.on('data', parse);
    child.once('error', error => { clearTimeout(timeout); reject(error); });
    child.once('exit', code => {
      clearTimeout(timeout);
      if (!found) reject(new Error('Cloudflared encerrou antes de conectar.'));
      else if (!stopping) { console.error('O tunel encerrou. Reinicie npm start.'); stop(code || 1); }
    });
  });
}

try {
  await ensureMetroPortFree();
  proxy = await createHeaderProxy();
  const tunnel = localOnly ? null : await openTunnel();
  const env = { ...process.env };
  if (tunnel) env.EXPO_PACKAGER_PROXY_URL = tunnel;
  else delete env.EXPO_PACKAGER_PROXY_URL;
  const metro = spawn(process.execPath, [resolve(root, 'node_modules/expo/bin/cli'), 'start', '--lan', '--port', '8088'], { cwd: root, env, windowsHide: true, stdio: ['inherit', 'pipe', 'pipe'] });
  children.push(metro);
  metro.stdout.pipe(process.stdout);
  metro.stderr.pipe(process.stderr);
  metro.once('error', error => { console.error(error.message); stop(1); });
  metro.once('exit', code => { if (!stopping) stop(code || 0); });

  console.log('\nPratica 08 | Expo SDK 57');
  console.log('Navegador local: http://localhost:8089');
  if (tunnel) {
    // exps abre o manifesto por HTTPS no Expo Go. exp://host:443 tentaria HTTP na porta TLS.
    const link = 'exps://' + new URL(tunnel).hostname;
    const qrFile = resolve(root, '.expo', 'qr-aula08.png');
    await mkdir(resolve(root, '.expo'), { recursive: true });
    await QRCode.toFile(qrFile, link, { width: 370, margin: 4 });
    console.log('Expo Go: ' + link);
    console.log('Web publico: ' + tunnel);
    console.log('QR salvo em: ' + qrFile);
    console.log(await QRCode.toString(link, { type: 'terminal', small: true }));
    console.log('Use este QR no Expo Go SDK 57. Aguarde o Metro terminar de iniciar.');
  }
} catch (error) {
  console.error(error.message);
  stop(1);
}
