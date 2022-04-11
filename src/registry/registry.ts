import {IEntry} from './contract';
import {Entry} from './entry'

export class Registry {

  private map = new Map<any, Entry[]>();

  has<T>(provide: T): boolean {
    return this.map.has(provide);
  }

  get<T>(provide: T): Entry<T>[] | undefined {
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
      const isWrongMulti = existedEntries.some(x => !x.multi);
      if (isWrongMulti) {
        console.error(`In existing entries there is an entry with flag "multi" set to false. Existed entries:`, existedEntries.map(x => x.base));
        throw new Error(`All existing entries must have flag "multi" set to true`);
      }
      const isDuplicate = existedEntries.some(x => x.equals(entry));
      if (isDuplicate) {
        console.warn(`Prevented an attempt to add a duplicate to the registry. New entry:`, entry.base, `Existed entries:`, existedEntries.map(x => x.base));
        return;
      }
      existedEntries.push(entry);
      this.map.set(provide, existedEntries);
      return;
    }
    // for multi: false
    switch (existedEntries.length) {
      case 0:
        console.warn(`An empty list was returned for the registered entry. The entry is now filled in:`, entry.base);
        this.map.set(provide, [entry]);
        return;
      case 1:
        const existed = existedEntries[0];
        if (entry.equals(existed)) {
          console.warn(`Prevented an attempt to replace an existing entry with an identical one. New entry:`, entry.base);
          return;
        }
        if (existed.multi) {
          console.warn(`Can't replace multi with non-multi. New entry:`, entry.base, `Existed entry:`, existed.base);
          return;
        }
        console.warn(`The existing entry has been replaced with:`, entry.base);
        this.map.set(provide, [entry]);
        return;
    }
    console.error(`The registry contains several entries, but the new entry goes without the "multi" flag. New entry:`, entry.base, `Existed entries:`, existedEntries.map(x => x.base));
    throw new Error(`Flag "multi" must be set to true in new entry`);
  }

  get size(): number {
    return this.map.size;
  }

}
