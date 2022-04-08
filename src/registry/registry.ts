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
        console.error(`In existing records there is an entry with flag "multi" set to false. Existed entries:`, existedEntries.map(x => x.toSimple()));
        throw new Error(`All existing records should have flag "multi" set to true`);
      }
      const isExistedEntry = existedEntries.some(x => x.equals(entry));
      if (isExistedEntry) {
        console.warn(`Attempt to add a duplicate to the registry. New entry:`, entry.toSimple());
      } else {
        existedEntries.push(entry);
        this.map.set(provide, existedEntries);
      }
    } else {
      console.error(`The registry contains several entries, but the new entry goes without the "multi" flag. New entry:`, entry.toSimple());
      throw new Error(`"multi" flag must be set to true`);
    }
  }

}
