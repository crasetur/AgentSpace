import { promises as fs } from 'fs';
let instancePromise: Promise<WebAssembly.Instance> | null = null;

async function loadInstance(): Promise<WebAssembly.Instance> {
  if (instancePromise) return instancePromise;
  instancePromise = (async () => {
    const wasmPath =
      'rust-agent/plugin/target/wasm32-unknown-unknown/release/agent_plugin.wasm';
    const bytes = await fs.readFile(wasmPath);
    const { instance } = await WebAssembly.instantiate(bytes, {});
    return instance;
  })();
  return instancePromise;
}

export async function scoreTag(tag: number): Promise<number> {
  const inst = await loadInstance();
  const fn = inst.exports['score_tag'] as (x: number) => number;
  return fn(Number(tag) | 0);
}
