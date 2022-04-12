import {IEntry} from './contract'
import {Entry} from './entry'

export class Registry {

  private map = new Map<any, Entry[]>();

  get size(): number {
    return this.map.size;
  }

  has(provide: any): boolean {
    return this.map.has(provide);
  }

  get<TProvide>(provide: TProvide): Entry[] | undefined {
    const entries = this.map.get(provide);
    return Array.isArray(entries) ? [...entries] : undefined;
  }

  set(data: Entry | IEntry): void {
    const entry = data instanceof Entry ? data : new Entry(data);
    const {provide, multi} = entry;
    const existedEntries = this.get(provide);
    if (!existedEntries) {
      this.map.set(provide, [entry]);
      return;
    }
    if (multi) {
      const hasWrongMulti = existedEntries.some(x => !x.multi);
      if (hasWrongMulti) {
        console.error(`In existing entries there is an entry with flag "multi" set to false. New entry:`, entry.orig, `Existed entries:`, existedEntries.map(x => x.orig));
        throw new Error(`All existing entries for this "provide" must have flag "multi" set to true`);
      }
      const isDuplicate = existedEntries.some(x => x.equals(entry));
      if (isDuplicate) {
        console.warn(`Prevented an attempt to add a duplicate to the registry. New entry:`, entry.orig, `Existed entries:`, existedEntries.map(x => x.orig));
        return;
      }
      existedEntries.push(entry);
      this.map.set(provide, existedEntries);
      return;
    }
    // for multi: false
    switch (existedEntries.length) {
      case 0:
        console.warn(`An empty list was returned for the registered entry. The entry is now filled in:`, entry.orig);
        this.map.set(provide, [entry]);
        return;
      case 1:
        const existed = existedEntries[0];
        if (entry.equals(existed)) {
          console.warn(`Prevented an attempt to replace an existing entry with an identical one. New entry:`, entry.orig);
          return;
        }
        if (existed.multi) {
          console.warn(`Can't replace existed multi entry new with non-multi. New entry:`, entry.orig, `Existed entry:`, existed.orig);
          return;
        }
        console.warn(`The existing entry has been replaced with:`, entry.orig);
        this.map.set(provide, [entry]);
        return;
      default:
        console.error(`The registry contains several "multi" entries, but the new entry goes without the "multi" flag. New entry:`, entry.orig, `Existed entries:`, existedEntries.map(x => x.orig));
        throw new Error(`For this "provide" flag "multi" must be set to true in new entry`);
    }
  }

}
