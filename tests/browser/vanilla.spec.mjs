import { test, expect } from '@playwright/test';
import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { extname, join } from 'node:path';

let server; let origin;
test.beforeAll(async () => {
  server = createServer(async (request, response) => {
    if (request.url === '/') { response.setHeader('content-type', 'text/html'); response.end('<ui-button id="action">Execute</ui-button><ui-text-field id="field" label="Call sign"></ui-text-field><script type="module" src="/auto.js"></script>'); return; }
    try {
      const path = join(process.cwd(), 'ui', 'vanilla', 'dist', 'esm', request.url.slice(1));
      response.setHeader('content-type', extname(path) === '.js' ? 'text/javascript' : 'application/octet-stream');
      response.end(await readFile(path));
    } catch { response.statusCode = 404; response.end(); }
  });
  await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
  origin = `http://127.0.0.1:${server.address().port}`;
});
test.afterAll(async () => new Promise((resolve) => server.close(resolve)));

test('registers interactive custom elements with keyboard and disabled behavior', async ({ page }) => {
  await page.goto(origin);
  await page.waitForFunction(() => customElements.get('ui-button') && customElements.get('ui-text-field'));
  const button = page.locator('#action').locator('button');
  await expect(page.locator('#action')).toContainText('Execute');
  let clicks = 0;
  await page.exposeFunction('recordClick', () => { clicks += 1; });
  await page.locator('#action').evaluate((node) => node.addEventListener('click', () => window.recordClick()));
  await button.click();
  expect(clicks).toBe(1);
  await page.locator('#action').evaluate((node) => node.setAttribute('disabled', ''));
  await expect(button).toBeDisabled();
  await expect(page.locator('#field').locator('input')).toHaveAccessibleName('Call sign');
});
