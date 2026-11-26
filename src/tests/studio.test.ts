/**
 * MonarchUI Studio Server Integration Tests
 * Author: Jatin Sharma (https://jatinsh.netlify.app/)
 */

import test from 'node:test';
import assert from 'node:assert';
import http from 'http';
import { StudioServer } from '../studio/server.js';

function getUrl(url: string): Promise<{ status: number; body: string }> {
  return new Promise((resolve, reject) => {
    http.get(url, (res: http.IncomingMessage) => {
      let data = '';
      res.on('data', (c: any) => (data += c));
      res.on('end', () => resolve({ status: res.statusCode || 200, body: data }));
    }).on('error', reject);
  });
}

test('StudioServer: serves interactive HTML studio and REST registry APIs', async () => {
  const port = 8999;
  const studio = new StudioServer(port);
  await studio.start();

  try {
    const html = await getUrl(`http://localhost:${port}/`);
    assert.strictEqual(html.status, 200);
    assert.ok(html.body.includes('MonarchUI Studio'));

    const comps = await getUrl(`http://localhost:${port}/api/components`);
    assert.strictEqual(comps.status, 200);
    const parsed = JSON.parse(comps.body);
    assert.strictEqual(parsed.length, 12);

    const css = await getUrl(`http://localhost:${port}/api/theme-css?id=royal-obsidian`);
    assert.strictEqual(css.status, 200);
    assert.ok(css.body.includes('--monarch-accent'));
  } finally {
    await studio.stop();
  }
});
