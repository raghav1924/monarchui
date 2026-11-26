/**
 * MonarchUI Registry Tests
 * Author: Jatin Sharma (https://jatinsh.netlify.app/)
 */

import test from 'node:test';
import assert from 'node:assert';
import { ComponentRegistry } from '../registry/components.js';

test('ComponentRegistry: exposes 12 complete luxury components', () => {
  const list = ComponentRegistry.list();
  assert.strictEqual(list.length, 12);

  for (const c of list) {
    assert.ok(c.id.length > 0);
    assert.ok(c.reactCode.includes('export function'), `${c.id} missing React export`);
    assert.ok(c.vanillaCode.includes('<style>'), `${c.id} missing Vanilla CSS`);
    assert.ok(c.designPatterns.length > 0, `${c.id} missing design patterns`);
    assert.ok(c.props.length > 0, `${c.id} missing props API`);
  }
});

test('ComponentRegistry: search filters by name and category', () => {
  const spatial = ComponentRegistry.search('Spatial');
  assert.ok(spatial.length >= 2);
  assert.ok(ComponentRegistry.getById('spotlight-bento'));
});
