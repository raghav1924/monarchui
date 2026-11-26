/**
 * MonarchUI Ambient Node.js 22 Type Definitions
 * Author: Jatin Sharma (https://jatinsh.netlify.app/)
 */

declare namespace NodeJS {
  interface Process {
    argv: string[];
    version: string;
    cwd(): string;
    exit(code?: number): never;
    env: Record<string, string | undefined>;
    platform: string;
    stdout: { write(str: string): boolean };
    stderr: { write(str: string): boolean };
    on(event: string, listener: (...args: any[]) => void): this;
  }
  interface Timeout {}
}

declare const process: NodeJS.Process;
declare const console: {
  log(...args: any[]): void;
  error(...args: any[]): void;
  warn(...args: any[]): void;
  info(...args: any[]): void;
};

declare module 'fs' {
  export function existsSync(path: string): boolean;
  export function mkdirSync(path: string, options?: { recursive?: boolean }): void;
  export function writeFileSync(path: string, data: string, encoding?: string): void;
  export function readFileSync(path: string, encoding: string): string;
  export function rmSync(path: string, options?: { recursive?: boolean; force?: boolean }): void;
}
declare module 'node:fs' { export * from 'fs'; }

declare module 'path' {
  export function join(...paths: string[]): string;
  export function resolve(...paths: string[]): string;
  export function dirname(p: string): string;
}
declare module 'node:path' { export * from 'path'; }

declare module 'os' {
  export function tmpdir(): string;
}
declare module 'node:os' { export * from 'os'; }

declare module 'events' {
  export class EventEmitter {
    on(event: string, listener: (...args: any[]) => void): this;
  }
}

declare module 'http' {
  import { EventEmitter } from 'events';
  export interface IncomingMessage extends EventEmitter {
    url?: string;
    method?: string;
    statusCode?: number;
    headers: Record<string, string | string[] | undefined>;
    on(event: 'data', listener: (chunk: any) => void): this;
    on(event: 'end', listener: () => void): this;
  }
  export interface ServerResponse extends EventEmitter {
    writeHead(statusCode: number, headers?: Record<string, any>): this;
    setHeader(name: string, value: string | number | readonly string[]): this;
    end(chunk?: any, callback?: () => void): this;
  }
  export interface Server extends EventEmitter {
    listen(port: number, callback?: () => void): this;
    close(callback?: (err?: Error) => void): this;
  }
  export function createServer(requestListener?: (req: IncomingMessage, res: ServerResponse) => void): Server;
  export function get(url: any, callback?: (res: IncomingMessage) => void): any;
}
declare module 'node:http' { export * from 'http'; }

declare module 'node:test' {
  export function test(name: string, fn: (t?: any) => void | Promise<void>): void;
  export default test;
}

declare module 'node:assert' {
  export function strictEqual<T>(actual: unknown, expected: T, message?: string | Error): void;
  export function ok(value: unknown, message?: string | Error): void;
  const assert: {
    strictEqual: typeof strictEqual;
    ok: typeof ok;
  };
  export default assert;
}
