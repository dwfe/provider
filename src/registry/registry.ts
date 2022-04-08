import {normalizeEntry} from '../util';
import {TEntry} from '../contract'
import {isEqual} from '@do-while-for-each/common';

export class Registry {

  private map = new Map<any, TEntry[]>();

  set(entry: TEntry): void {
    entry = normalizeEntry(entry);
    this.addToMap(entry);
  }

  get<T>(provide: T): TEntry[] | undefined {
    return this.map.get(provide);
  }

  private addToMap(entry: TEntry) {
    const {provide, multi} = entry;
    const existedEntries = this.get(provide);
    if (!existedEntries) {
      this.map.set(provide, [entry]);
      return;
    }
    if (multi) {
      existedEntries.some(x => isEqual(x, entry))
    }

  }


}
