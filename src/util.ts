import {TEntry} from './contract';

export const isClass = (value: any): boolean =>
  typeof value === 'function'
;


export function normalizeEntry(entry: TEntry): TEntry {
  if (!entry.useClass && isClass(entry.provide)) {
    entry.useClass = entry.provide;
  }
  return entry;
}
