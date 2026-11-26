/**
 * MonarchUI CLI Component Installer & Project Scaffolder
 * Writes copy-pasteable React/Tailwind or Vanilla HTML/CSS components into target projects.
 * Author: Jatin Sharma (https://jatinsh.netlify.app/)
 */

import fs from 'fs';
import path from 'path';
import { ComponentRegistry } from '../registry/components.js';
import { InstallResult, ThemePresetId } from '../types.js';
import { ThemeEngine } from './themeEngine.js';

export class ComponentInstaller {
  static initTheme(targetDir: string, preset: ThemePresetId = 'royal-obsidian'): string[] {
    const outDir = path.resolve(targetDir, 'components/monarch');
    if (!fs.existsSync(outDir)) {
      fs.mkdirSync(outDir, { recursive: true });
    }

    const cssPath = path.join(outDir, 'monarch-tokens.css');
    const twPath = path.join(outDir, 'monarch.tailwind.ts');

    fs.writeFileSync(cssPath, ThemeEngine.generateCssVariables(preset), 'utf8');
    fs.writeFileSync(twPath, ThemeEngine.generateTailwindConfig(preset), 'utf8');

    return [cssPath, twPath];
  }

  static installComponent(
    componentId: string,
    targetDir: string,
    framework: 'react' | 'vanilla' = 'react'
  ): InstallResult {
    const comp = ComponentRegistry.getById(componentId);
    if (!comp) {
      throw new Error(`Unknown MonarchUI component "${componentId}". Run "monarchui list" to view all 12 components.`);
    }

    const outDir = path.resolve(targetDir, 'components/monarch');
    if (!fs.existsSync(outDir)) {
      fs.mkdirSync(outDir, { recursive: true });
    }

    const filename =
      framework === 'react'
        ? comp.filename
        : `${comp.id}.html`;
    const fullPath = path.join(outDir, filename);
    const content = framework === 'react' ? comp.reactCode : comp.vanillaCode;

    fs.writeFileSync(fullPath, content, 'utf8');

    return {
      componentId: comp.id,
      targetDir: outDir,
      filesWritten: [fullPath],
      framework
    };
  }
}
