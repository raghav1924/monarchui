#!/usr/bin/env node
/**
 * MonarchUI CLI Interface
 * Author: Jatin Sharma (https://jatinsh.netlify.app/)
 */

import { ComponentInstaller } from './core/installer.js';
import { ThemeEngine } from './core/themeEngine.js';
import { ComponentRegistry } from './registry/components.js';
import { StudioServer } from './studio/server.js';
import { ThemePresetId } from './types.js';

const VERSION = '1.0.0';

function printHelp() {
  console.log(`
\x1b[33m   ____      _   _   _ ___ \x1b[0m
\x1b[33m  |  _ \\    | | | | | |_ _|\x1b[0m
\x1b[33m  | |_) |   | | | | | || | \x1b[0m
\x1b[33m  |  _ < _  | | | |_| || | \x1b[0m
\x1b[33m  |_| \\_(_) |_|  \\___/|___|\x1b[0m
\x1b[90m  v${VERSION} | RenderJet (RJ) Spatial & Bento Component Registry\x1b[0m
\x1b[90m  Architect: Jatin Sharma (https://jatinsh.netlify.app/)\x1b[0m

\x1b[1mUSAGE:\x1b[0m
  rjui <command> [options]

\x1b[1mCOMMANDS:\x1b[0m
  \x1b[33mstudio\x1b[0m [--port 7272]       Launch Interactive Luxury Component Studio
  \x1b[33mlist\x1b[0m                       List all 12 Royal & Spatial UI components
  \x1b[33madd <id|all>\x1b[0m [--vanilla]   Install component source into ./components/monarch/
  \x1b[33minit\x1b[0m [--theme preset]      Generate monarch-tokens.css & Tailwind preset
  \x1b[33mthemes\x1b[0m                     List available luxury theme presets
  \x1b[33mversion\x1b[0m                    Print version
  \x1b[33mhelp\x1b[0m                       Show help
`);
}

async function main() {
  const args = process.argv.slice(2);
  const cmd = args[0] || 'help';

  switch (cmd) {
    case 'list': {
      console.log('\n\x1b[1m=== RENDERJET (RJ) REGISTRY (12 COMPONENTS) ===\x1b[0m\n');
      for (const c of ComponentRegistry.list()) {
        console.log(`  \x1b[33m${c.id.padEnd(20)}\x1b[0m [${c.tier.padEnd(9)}] ${c.name} — ${c.tagline}`);
      }
      console.log('');
      break;
    }
    case 'themes': {
      console.log('\n\x1b[1m=== RENDERJET (RJ) THEME PRESETS ===\x1b[0m\n');
      for (const t of ThemeEngine.listPresets()) {
        console.log(`  \x1b[33m${t.id.padEnd(18)}\x1b[0m ${t.name} (${t.accentPrimary})`);
      }
      console.log('');
      break;
    }
    case 'init': {
      const tIdx = args.indexOf('--theme');
      const preset = (tIdx !== -1 ? args[tIdx + 1] : 'royal-obsidian') as ThemePresetId;
      const files = ComponentInstaller.initTheme(process.cwd(), preset);
      console.log(`\x1b[32m✔ Initialized RenderJet (RJ) tokens (${preset}):\x1b[0m`);
      files.forEach((f) => console.log(`  - ${f}`));
      break;
    }
    case 'add': {
      const target = args[1];
      if (!target) {
        console.error('Error: Specify a component id or "all". Run "rjui list".');
        process.exit(1);
      }
      const fw = args.includes('--vanilla') ? 'vanilla' : 'react';
      const ids = target === 'all' ? ComponentRegistry.list().map((c) => c.id) : [target];
      for (const id of ids) {
        const res = ComponentInstaller.installComponent(id, process.cwd(), fw);
        console.log(`\x1b[32m✔ Installed ${res.componentId}\x1b[0m -> ${res.filesWritten[0]}`);
      }
      break;
    }
    case 'studio': {
      const pIdx = args.indexOf('--port');
      const port = pIdx !== -1 && args[pIdx + 1] ? parseInt(args[pIdx + 1], 10) : 7272;
      const studio = new StudioServer(port);
      await studio.start();
      console.log(`\x1b[33m✔ RenderJet (RJ) Spatial Studio live at http://localhost:${port}\x1b[0m`);
      break;
    }
    case 'version':
    case '-v':
    case '--version':
      console.log(`v${VERSION}`);
      break;
    default:
      printHelp();
      break;
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
