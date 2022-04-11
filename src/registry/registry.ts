import {Entry} from './entry'

export class Registry {

  private map = new Map<any, Entry[]>();

  get<T>(provide: T): Entry[] | undefined {
    const entries = this.map.get(provide);
    return Array.isArray(entries) ? [...entries] : undefined;
  }

  set(entry: Entry): void {
    const {provide, multi} = entry;
    const existedEntries = this.get(provide);
    if (!existedEntries) {
      this.map.set(provide, [entry]);
      return;
    }
    if (multi) {
      const isDuplicate = existedEntries.some(x => x.equals(entry));
      if (isDuplicate) {
        console.warn(`Prevented an attempt to add a duplicate to the registry. New entry:`, entry.base, `Existed entries:`, existedEntries.map(x => x.base));
        return;
      }
      existedEntries.push(entry);
      this.map.set(provide, existedEntries);
    } else {
      if (existedEntries.length === 0) {
        this.map.set(provide, [entry]);
        console.warn(`An empty list was returned for the registered entry. The entry is now filled in:`, entry.base);
        return;
      } else if (existedEntries.length === 1) {
        this.map.set(provide, [entry]);
        console.warn(`The existing entry has been replaced with:`, entry.base);
        return;
      }
      console.error(`The registry contains several entries, but the new entry goes without the "multi" flag. New entry:`, entry.base, `Existed entries:`, existedEntries.map(x => x.base));
      throw new Error(`Flag "multi" must be set to true in new entry`);
    }
  }

}
