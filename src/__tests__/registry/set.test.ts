import {describe, expect} from '@jest/globals';
import {Entry, Registry} from '../../registry';
import {Duck, Turkey} from '../abc/bird';

function getEntry(registry: Registry, provide: any): Entry {
  const result = registry.get(provide) as Array<any>
  expect(Array.isArray(result) && result.length === 1).toBe(true);
  const entry = result[0];
  expect((entry instanceof Entry)).toBe(true);
  expect(entry).toHaveProperty('provide', provide);
  return entry;
}

describe(`Registry.set`, () => {

  test(`no existing entries`, () => {
    const registry = new Registry();
    expect(registry.size).toBe(0);

    registry.set({provide: Duck});
    expect(registry.size).toBe(1);
    getEntry(registry, Duck);
    expect(registry.size).toBe(1);
  });

  test(`normalize entry`, () => {
    const registry = new Registry();
    expect(registry.size).toBe(0);

    registry.set({provide: Duck});
    expect(registry.size).toBe(1);

    registry.set(new Entry({provide: Turkey}));
    expect(registry.size).toBe(2);

    getEntry(registry, Duck);
    getEntry(registry, Turkey);
    expect(registry.size).toBe(2);
  });

  test(`multi. wrong multi`, () => {
  });

  test(`multi. duplicate`, () => {
    const registry = new Registry();
    registry.set({provide: Duck});
  });

  test(`multi. add one more`, () => {
  });

  test(`noMulti. existed.length === 0`, () => {
  });

  test(`noMulti. existed.length === 1, do not replace identical one`, () => {
    const registry = new Registry();

    registry.set({provide: Duck});
    const duckEntry1 = getEntry(registry, Duck);

    registry.set({provide: Duck});
    const duckEntry2 = getEntry(registry, Duck);

    expect(duckEntry1 === duckEntry2).toBe(true);
    expect(registry.size).toBe(1);
  });

  test(`noMulti. disable replace multi with non-multi`, () => {
  });

  test(`noMulti. existed.length === 1, replace existed`, () => {
    const registry = new Registry();

    registry.set({provide: Duck});
    const duckEntry1 = getEntry(registry, Duck);

    registry.set({provide: Duck, useClass: Turkey});
    const duckEntry2 = getEntry(registry, Duck);

    expect(duckEntry1 === duckEntry2).toBe(false);
    expect(registry.size).toBe(1);
  });

  test(`noMulti. existed.length > 1`, () => {
  });

  test(``, () => {
  });

  // test(``, () => {});
  // test(``, () => {});
  // test(``, () => {});
  // test(``, () => {});

});
