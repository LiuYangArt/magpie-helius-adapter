import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

const source = readFileSync(new URL('./helius.middleware.js', import.meta.url), 'utf8');
const { onProvider } = await import('data:text/javascript;base64,' + Buffer.from(source).toString('base64'));
const context = { provider: { id: 'helius' }, protocol: 'responses' };

test('rewrites other and preserves adjacent fields', () => {
  const body = { input: [{ type: 'web_search_call', id: 'ws_test', action: { type: 'other', query: 'test' } }], model: 'helius/test' };
  assert.deepEqual(onProvider(body, context), {
    input: [{ type: 'web_search_call', id: 'ws_test', action: { type: 'search', query: 'test' } }], model: 'helius/test'
  });
});
test('leaves another provider unchanged', () => {
  const body = { input: [{ action: { type: 'other' } }] };
  const before = structuredClone(body);
  onProvider(body, { ...context, provider: { id: 'rayincode-codex' } });
  assert.deepEqual(body, before);
});
test('leaves another protocol unchanged', () => {
  const body = { input: [{ action: { type: 'other' } }] };
  const before = structuredClone(body);
  onProvider(body, { ...context, protocol: 'chat' });
  assert.deepEqual(body, before);
});
test('preserves valid actions and ordinary messages', () => {
  const body = { input: ['text', null, { role: 'user', content: 'other' }, ...['search', 'open_page', 'find_in_page'].map(type => ({ action: { type } }))] };
  const before = structuredClone(body);
  assert.deepEqual(onProvider(body, context), before);
});
test('accepts missing input and absent provider without changes', () => {
  for (const body of [null, {}, { input: 'text' }]) {
    assert.equal(onProvider(body, context), body);
  }
  const body = { input: [{ action: { type: 'other' } }] };
  const before = structuredClone(body);
  assert.deepEqual(onProvider(body, { protocol: 'responses' }), before);
});
