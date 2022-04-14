import {IEntry} from './contract'
import {Entry} from './entry'
import {arraysEqualStrictCheck} from '../util';

export class Registry {

  private store = new Map<any, Entry[]>();

  get size(): number {
    return this.store.size;
  }

  has(provide: any): boolean {
    return this.store.has(provide);
  }

  /**
   * @param provide - First level filter
   * @param deps - Second level filter
   * @return Non-empty array | undefined
   */
  get(provide: any, deps?: any[]): Entry[] | undefined {
    let entries = this.store.get(provide); // 1
    if (!entries || entries.length === 0)
      return;
    entries = [...entries];
    if (deps && deps.length > 0) { // 2
      const result = entries.filter(x => arraysEqualStrictCheck(x.deps, deps));
      return result.length ? result : undefined;
    }
    return entries;
  }

  set(data: Entry | IEntry): void {
    const entry = data instanceof Entry ? data : new Entry(data);
    const {provide, multi} = entry;
    const existedArr = this.get(provide);
    if (!existedArr) {
      this.store.set(provide, [entry]);
      return;
    }
    if (multi) {
      const hasWrongMulti = existedArr.some(x => !x.multi);
      if (hasWrongMulti) {
        console.error(`There is a non-multi entry in existing, but new is multi. New:`, entry.orig, `Existed:`, existedArr.map(x => x.orig));
        throw new Error(`All existing entries for this "provide" must have flag "multi" set to true`);
      }
      const hasDuplicate = existedArr.some(x => x.equals(entry));
      if (hasDuplicate) {
        console.warn(`Prevented an attempt to add a duplicate. New:`, entry.orig, `Existed:`, existedArr.map(x => x.orig));
        return;
      }
      existedArr.push(entry);
      this.store.set(provide, existedArr);
      return;
    }
    /**
     * here multi: false
     */
    if (existedArr.length > 1) {
      console.error(`Attempting to add a non-multi entry when more than one entry already exists. New:`, entry.orig, `Existed:`, existedArr.map(x => x.orig));
      throw new Error(`Attempting to add a non-multi entry when more than one entry already exists`);
    }
    const existed = existedArr[0];
    if (existed.multi) {
      console.warn(`It's not allowed to replace existed multi entry with a new non-multi. New:`, entry.orig, `Existed:`, existed.orig);
      return;
    }
    if (entry.equals(existed)) {
      console.warn(`Prevented an attempt to replace an existing entry with an identical one. New:`, entry.orig);
      return;
    }
    this.store.set(provide, [entry]);
    console.warn(`The existing entry has been replaced with a new one:`, entry.orig);
  }

}
