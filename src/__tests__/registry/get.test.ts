import {describe, expect} from '@jest/globals';
import {Entry, Registry} from '../../registry';
import {Duck, Turkey} from '../abc/bird';

describe(`Registry.get`, () => {

  test(`no entry`, () => {
    const registry = new Registry();
    expect(registry.get(Duck)).toBe(undefined);
    expect(registry.get(null)).toBe(undefined);
    expect(registry.get(123)).toBe(undefined);

    registry.set(new Entry({provide: Duck}));
    expect(registry.get(Turkey)).toBe(undefined);
  });

  test(`entry exists`, () => {
    const registry = new Registry();
    registry.set(new Entry({provide: Duck}));
    const result = registry.get(Duck);
    expect(Array.isArray(result) && result.length === 1).toBe(true);
  });

  test(`clone result arr`, () => {
    const registry = new Registry();
    registry.set(new Entry({provide: Duck}));

    const result1 = registry.get(Duck);
    const result2 = registry.get(Duck);
    expect(Array.isArray(result1)).toBe(true);
    expect(Array.isArray(result2)).toBe(true);
    expect(result1 === result2).toBe(false);
  });

});
