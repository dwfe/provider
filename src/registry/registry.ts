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
      const isWrongMulti = existedEntries.some(x => !x.multi);
      if (isWrongMulti) {
        console.error(`In existing entries there is an entry with flag "multi" set to false. Existed entries:`, existedEntries.map(x => x.toSimple()));
        throw new Error(`All existing entries must have flag "multi" set to true`);
      }
      const isDuplicate = existedEntries.some(x => x.equals(entry));
      if (isDuplicate) {
        console.warn(`Skipped attempt to add a duplicate to the registry. New entry:`, entry.toSimple(), `Existed entries:`, existedEntries.map(x => x.toSimple()));
        return;
      }
      existedEntries.push(entry);
      this.map.set(provide, existedEntries);
    } else {
      if (existedEntries.length === 0) {
        this.map.set(provide, [entry]);
        console.warn(`An empty list was returned for the registered entry. The entry is now filled in:`, entry.toSimple());
        return;
      } else if (existedEntries.length === 1) {
        this.map.set(provide, [entry]);
        console.warn(`The existing entry has been replaced with:`, entry.toSimple());
        return;
      }
      console.error(`The registry contains several entries, but the new entry goes without the "multi" flag. New entry:`, entry.toSimple(), `Existed entries:`, existedEntries.map(x => x.toSimple()));
      throw new Error(`Flag "multi" must be set to true in new entry`);
    }
  }

}
