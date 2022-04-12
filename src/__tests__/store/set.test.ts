import {describe, expect} from '@jest/globals';
import {Store} from '../../store'

// function getEntry(registry: Registry, provide: any): Entry {
//   const result = registry.get(provide) as Array<any>
//   expect(Array.isArray(result) && result.length === 1).toBe(true);
//   const entry = result[0];
//   expect((entry instanceof Entry)).toBe(true);
//   expect(entry).toHaveProperty('provide', provide);
//   return entry;
// }
//
// function getEntries(registry: Registry, provide: any): Entry[] {
//   const result = registry.get(provide) as Array<any>
//   expect(Array.isArray(result) && result.length > 1).toBe(true);
//   expect(result.some(x => !x.multi)).toBe(false);
//   expect(result.some(x => x.provide !== provide)).toBe(false);
//   return result;
// }

describe(`Store.set`, () => {

  test(`normalize entry`, () => {
    const store = new Store();
    expect(store.size).toBe(0);


  });


});
