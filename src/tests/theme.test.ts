/**
 * MonarchUI Theme Engine Tests
 * Author: Jatin Sharma (https://jatinsh.netlify.app/)
 */

import test from 'node:test';
import assert from 'node:assert';
import { ThemeEngine } from '../core/themeEngine.js';

test('ThemeEngine: lists 4 luxury presets and generates CSS & Tailwind configs', () => {
  const presets = ThemeEngine.listPresets();
  assert.strictEqual(presets.length, 4);

  const css = ThemeEngine.generateCssVariables('royal-obsidian');
  assert.ok(css.includes('--monarch-accent: #e5c158'));

  const tw = ThemeEngine.generateTailwindConfig('apple-frost');
  assert.ok(tw.includes('#0071e3'));
});
