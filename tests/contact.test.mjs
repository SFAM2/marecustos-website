import { readFile } from 'node:fs/promises';
import assert from 'node:assert/strict';
import { afterEach, beforeEach, test } from 'node:test';

const source = await readFile(new URL('../pages/api/contact.js', import.meta.url), 'utf8');
const { default: handler } = await import(`data:text/javascript;base64,${Buffer.from(source).toString('base64')}`);
const originalFetch = globalThis.fetch;
const envNames = ['RESEND_API_KEY', 'CONTACT_FROM', 'CONTACT_TO', 'TURNSTILE_SECRET', 'NEXT_PUBLIC_TURNSTILE_SITE_KEY', 'TURNSTILE_HOSTNAMES'];
let previousEnv;

beforeEach(() => {
  previousEnv = Object.fromEntries(envNames.map((name) => [name, process.env[name]]));
  Object.assign(process.env, {
    RESEND_API_KEY: 'test-only', CONTACT_FROM: 'website@example.com', CONTACT_TO: 'contact@example.com',
    TURNSTILE_SECRET: 'test-only', NEXT_PUBLIC_TURNSTILE_SITE_KEY: 'test-only', TURNSTILE_HOSTNAMES: 'example.com',
  });
  globalThis.fetch = async () => { throw new Error('Unexpected outgoing request'); };
});

afterEach(() => {
  globalThis.fetch = originalFetch;
  for (const [name, value] of Object.entries(previousEnv)) {
    if (value === undefined) delete process.env[name];
    else process.env[name] = value;
  }
});

async function submit(body = {}, headers = {}) {
  const res = { code: 0, setHeader() {}, status(code) { this.code = code; return this; }, json(value) { this.body = value; return this; }, end() { return this; } };
  await handler({ method: 'POST', headers: { origin: 'https://example.com', host: 'example.com', ...headers }, body: {
    name: 'Test', email: 'visitor@example.com', consent: 'on', website: '', 'cf-turnstile-response': 'fresh-token', ...body,
  } }, res);
  return res;
}

test('honeypot accepts silently without sending an email', async () => {
  let calls = 0;
  globalThis.fetch = async () => { calls++; throw new Error('Must not call provider'); };
  assert.equal((await submit({ website: 'spam.example' })).code, 200);
  assert.equal(calls, 0);
});

test('invalid origins and missing consent are rejected', async () => {
  assert.equal((await submit({}, { origin: 'invalid' })).code, 403);
  assert.equal((await submit({}, { origin: 'https://other.example' })).code, 403);
  assert.equal((await submit({ consent: '' })).code, 400);
});

test('missing and oversized tokens are rejected before external requests', async () => {
  assert.equal((await submit({ 'cf-turnstile-response': '' })).code, 403);
  assert.equal((await submit({ 'cf-turnstile-response': 'x'.repeat(2049) })).code, 403);
});

for (const [name, result] of [
  ['failed challenge', { success: false, action: 'contact', hostname: 'example.com' }],
  ['wrong hostname', { success: true, action: 'contact', hostname: 'attacker.example' }],
  ['wrong action', { success: true, action: 'login', hostname: 'example.com' }],
]) {
  test(`rejects ${name} without sending an email`, async () => {
    let calls = 0;
    globalThis.fetch = async (url) => {
      calls++;
      assert.equal(url, 'https://challenges.cloudflare.com/turnstile/v0/siteverify');
      return { ok: true, json: async () => result };
    };
    assert.equal((await submit()).code, 403);
    assert.equal(calls, 1);
  });
}

test('verification outage fails closed', async () => {
  assert.equal((await submit()).code, 403);
  globalThis.fetch = async () => ({ ok: false });
  assert.equal((await submit()).code, 403);
});

test('partial Turnstile configuration fails closed', async () => {
  delete process.env.TURNSTILE_SECRET;
  assert.equal((await submit()).code, 503);
});

test('valid verification sends once and a simulated replay is rejected', async () => {
  let verified = false;
  let emails = 0;
  globalThis.fetch = async (url, options) => {
    if (url.includes('/siteverify')) {
      assert.equal(options.body.get('response'), 'fresh-token');
      const success = !verified;
      verified = true;
      return { ok: true, json: async () => ({ success, action: 'contact', hostname: 'example.com' }) };
    }
    assert.equal(url, 'https://api.resend.com/emails');
    assert.equal(JSON.parse(options.body).reply_to, 'visitor@example.com');
    emails++;
    return { ok: true };
  };
  assert.equal((await submit()).code, 200);
  assert.equal((await submit()).code, 403);
  assert.equal(emails, 1);
});

test('provider failure never reports success', async () => {
  globalThis.fetch = async (url) => url.includes('/siteverify')
    ? { ok: true, json: async () => ({ success: true, action: 'contact', hostname: 'example.com' }) }
    : { ok: false };
  assert.equal((await submit()).code, 502);
});
