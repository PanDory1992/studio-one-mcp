// Uszy ("ears"): our own VST3 loudness meter + gain trim. Each instance writes
// %LOCALAPPDATA%\CodexPedalModes\uszy\<id>.json every 250 ms ({mom, short, peak, gain_db, created, ...})
// and applies <id>.set.json {"gain_db": x}. kanaly.json maps id -> channel name.
import { readFileSync, writeFileSync, readdirSync, existsSync } from 'node:fs';
import { join } from 'node:path';

export const uszyDir = () => join(process.env.LOCALAPPDATA || '', 'CodexPedalModes', 'uszy');
const read = (f) => { try { return JSON.parse(readFileSync(join(uszyDir(), f), 'utf8')); } catch { return null; } };
export const names = () => read('kanaly.json') || {};

export function instances() {
  const dir = uszyDir();
  if (!existsSync(dir)) return [];
  const map = names();
  const now = Date.now() / 1000;
  return readdirSync(dir)
    .filter((f) => /^[0-9a-f]{12}\.json$/.test(f))
    .map((f) => read(f))
    .filter(Boolean)
    .map((d) => ({ id: d.id, channel: map[d.id] || null, alive: now - d.t < 2, created: d.created, mom: d.mom, short: d.short, peak: d.peak, gain_db: d.gain_db }))
    .sort((a, b) => a.created - b.created);
}

export function resolve(idOrChannel) {
  const all = instances();
  const hit = all.filter((i) => i.id === idOrChannel || i.channel === idOrChannel);
  if (hit.length !== 1) throw new Error(hit.length ? `ambiguous: ${idOrChannel}` : `no Uszy instance for ${idOrChannel} (known: ${all.map((i) => i.channel || i.id).join(', ')})`);
  return hit[0];
}

export function setName(id, channel) {
  const map = names();
  map[id] = channel;
  writeFileSync(join(uszyDir(), 'kanaly.json'), JSON.stringify(map, null, 1));
  return map;
}

export function setGain(idOrChannel, { gain_db, add_db }) {
  const inst = resolve(idOrChannel);
  const g = Math.max(-40, Math.min(24, gain_db ?? inst.gain_db + (add_db || 0)));
  writeFileSync(join(uszyDir(), `${inst.id}.set.json`), JSON.stringify({ gain_db: g }));
  return { id: inst.id, channel: inst.channel, before: inst.gain_db, after: g };
}

/** Loudness over `seconds` per instance: energy mean of momentary values above -70 LUFS, max peak. */
export async function measure(seconds = 10, which = null) {
  const end = Date.now() + Math.min(60, seconds) * 1000;
  const acc = new Map();
  while (Date.now() < end) {
    for (const i of instances()) {
      if (which && !which.includes(i.id) && !which.includes(i.channel)) continue;
      const a = acc.get(i.id) || { id: i.id, channel: i.channel, gain_db: i.gain_db, e: 0, n: 0, peak: -120 };
      if (i.alive && i.mom > -70) { a.e += 10 ** (i.mom / 10); a.n++; }
      a.peak = Math.max(a.peak, i.peak);
      acc.set(i.id, a);
    }
    await new Promise((r) => setTimeout(r, 250));
  }
  return [...acc.values()].map((a) => ({ id: a.id, channel: a.channel, gain_db: a.gain_db, lufs: a.n ? Math.round(10 * Math.log10(a.e / a.n) * 10) / 10 : null, samples: a.n, peakDb: Math.round(a.peak * 10) / 10 }));
}
