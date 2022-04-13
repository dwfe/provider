import {ITemplate} from '../contract'
import {Template} from './template'

export class TemplateStore {

  private templates = new Map<any, Template[]>();

  get size(): number {
    return this.templates.size;
  }

  get(provide: any, deps?: any[]): Template[] | undefined {
    const entries = this.templates.get(provide);
    return Array.isArray(entries) ? [...entries] : undefined;
  }

  set(data: Template | ITemplate): void {
    const template = data instanceof Template ? data : new Template(data);
    const {provide, multi} = template;
    const existedEntries = this.get(provide);
    if (!existedEntries) {
      this.templates.set(provide, [template]);
      return;
    }
    if (multi) {
      const hasWrongMulti = existedEntries.some(x => !x.multi);
      if (hasWrongMulti) {
        console.error(`In existing entries there is an entry with flag "multi" set to false. New entry:`, template.orig, `Existed entries:`, existedEntries.map(x => x.orig));
        throw new Error(`All existing entries for this "provide" must have flag "multi" set to true`);
      }
      const isDuplicate = existedEntries.some(x => x.equals(template));
      if (isDuplicate) {
        console.warn(`Prevented an attempt to add a duplicate to the registry. New entry:`, template.orig, `Existed entries:`, existedEntries.map(x => x.orig));
        return;
      }
      existedEntries.push(template);
      this.templates.set(provide, existedEntries);
      return;
    }
    // for multi: false
    switch (existedEntries.length) {
      case 0:
        console.warn(`An empty list was returned for the registered entry. The entry is now filled in:`, template.orig);
        this.templates.set(provide, [template]);
        return;
      case 1:
        const existed = existedEntries[0];
        if (template.equals(existed)) {
          console.warn(`Prevented an attempt to replace an existing entry with an identical one. New entry:`, template.orig);
          return;
        }
        if (existed.multi) {
          console.warn(`Can't replace existed multi entry new with non-multi. New entry:`, template.orig, `Existed entry:`, existed.orig);
          return;
        }
        console.warn(`The existing entry has been replaced with:`, template.orig);
        this.templates.set(provide, [template]);
        return;
      default:
        console.error(`The registry contains several "multi" entries, but the new entry goes without the "multi" flag. New entry:`, template.orig, `Existed entries:`, existedEntries.map(x => x.orig));
        throw new Error(`For this "provide" flag "multi" must be set to true in new entry`);
    }
  }

}
