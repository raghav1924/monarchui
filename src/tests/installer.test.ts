/**
 * MonarchUI Installer Tests
 * Author: Jatin Sharma (https://jatinsh.netlify.app/)
 */

import test from 'node:test';
import assert from 'node:assert';
import fs from 'fs';
import os from 'os';
import path from 'path';
import { ComponentInstaller } from '../core/installer.js';

test('ComponentInstaller: writes theme tokens and React/Vanilla component files', () => {
  const tmpDir = path.join(os.tmpdir(), 'monarchui-test-' + Date.now());
  try {
    const tokenFiles = ComponentInstaller.initTheme(tmpDir, 'royal-obsidian');
    assert.strictEqual(tokenFiles.length, 2);
    assert.ok(fs.existsSync(tokenFiles[0]));

    const reactRes = ComponentInstaller.installComponent('spotlight-bento', tmpDir, 'react');
    assert.ok(fs.existsSync(reactRes.filesWritten[0]));

    const vanillaRes = ComponentInstaller.installComponent('spatial-dock', tmpDir, 'vanilla');
    assert.ok(fs.existsSync(vanillaRes.filesWritten[0]));
  } finally {
    fs.rmSync(tmpDir, { recursive: true, force: true });
  }
});
