import {describe, expect} from '@jest/globals';
import {Entry, Registry} from '../../registry';
import {Duck, Turkey} from '../abc/bird';
import {User} from '../abc/user';
import {L10nService} from '../abc/l10n.service';

//region Support

function getEntry(registry: Registry, provide: any): Entry {
  const result = registry.get(provide) as Array<any>
  expect(Array.isArray(result) && result.length === 1).toBe(true);
  const entry = result[0];
  expect((entry instanceof Entry)).toBe(true);
  expect(entry).toHaveProperty('provide', provide);
  return entry;
}

function getEntries(registry: Registry, provide: any): Entry[] {
  const result = registry.get(provide) as Array<any>
  expect(Array.isArray(result) && result.length > 1).toBe(true);
  expect(result.some(x => !x.multi)).toBe(false);
  expect(result.some(x => x.provide !== provide)).toBe(false);
  return result;
}

//endregion Support

describe(`Registry.set`, () => {

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

  test(`no existing entries`, () => {
    const registry = new Registry();
    expect(registry.size).toBe(0);

    registry.set({provide: Duck});
    expect(registry.size).toBe(1);
    getEntry(registry, Duck);
    expect(registry.size).toBe(1);
  });

  test(`multi. disable add multi if has non-multi`, () => {
    const registry = new Registry();

    registry.set({provide: Duck});
    expect(() => registry.set({provide: Duck, multi: true})).toThrow();
    expect(registry.size).toBe(1);
    expect(getEntry(registry, Duck).multi).toBe(false);
  });

  test(`multi. duplicate`, () => {
    const registry = new Registry();

    registry.set({provide: Duck, multi: true});
    expect(registry.size).toBe(1);

    registry.set({provide: Duck, multi: true});
    expect(registry.size).toBe(1);
    expect(getEntry(registry, Duck));
  });

  test(`multi. add one more`, () => {
    const registry = new Registry();

    registry.set({provide: Duck, multi: true});
    expect(registry.size).toBe(1);

    registry.set({provide: Duck, useClass: Turkey, multi: true});
    expect(registry.size).toBe(1);

    expect(getEntries(registry, Duck).length).toBe(2);
  });

  test(`multi. add one more, useValue`, () => {
    const registry = new Registry();

    registry.set({provide: User, useValue: 123, multi: true});
    expect(registry.size).toBe(1);

    registry.set({provide: User, deps: ['Tom'], useValue: 77, multi: true});
    expect(registry.size).toBe(1);
    expect(getEntries(registry, User).length).toBe(2);

    registry.set({provide: User, deps: ['Tom', L10nService], useValue: 42, multi: true});
    expect(registry.size).toBe(1);
    expect(getEntries(registry, User).length).toBe(3);

    registry.set({provide: User, deps: ['Tom', L10nService], useValue: 98, multi: true});
    expect(registry.size).toBe(1);
    expect(getEntries(registry, User).length).toBe(4);
  });

  test(`noMulti. existed.length === 0`, () => {
    const registry = new Registry();

    registry.set({provide: Duck});
    expect(registry.size).toBe(1);

    const values = registry['map'].get(Duck) as Array<any>;
    values.length = 0;
    expect(registry.size).toBe(1);

    registry.set({provide: Duck});
    expect(registry.size).toBe(1);

    getEntry(registry, Duck);
  });

  test(`noMulti. existed.length === 1, do not replace identical one`, () => {
    const registry = new Registry();

    registry.set({provide: Duck});
    const entry1 = getEntry(registry, Duck);

    registry.set({provide: Duck});
    const entry2 = getEntry(registry, Duck);

    expect(entry1 === entry2).toBe(true);
    expect(registry.size).toBe(1);
  });

  test(`noMulti. existed.length === 1, disable replace multi with non-multi`, () => {
    const registry = new Registry();

    registry.set({provide: Duck, multi: true});
    expect(registry.size).toBe(1);
    const entry1 = getEntry(registry, Duck);

    registry.set({provide: Duck, multi: false});
    expect(registry.size).toBe(1);
    const entry2 = getEntry(registry, Duck);

    expect(entry2.multi).toBe(true);
    expect(entry1 === entry2).toBe(true);
    expect(registry.size).toBe(1);
  });

  test(`noMulti. existed.length === 1, replace existed`, () => {
    const registry = new Registry();

    registry.set({provide: Duck});
    const entry1 = getEntry(registry, Duck);

    registry.set({provide: Duck, useClass: Turkey});
    const entry2 = getEntry(registry, Duck);

    expect(entry1 === entry2).toBe(false);
    expect(registry.size).toBe(1);
  });

  test(`noMulti. existed.length === 1, replace existed useValue #1`, () => {
    const registry = new Registry();

    registry.set({provide: Duck, useValue: null});
    const entry1 = getEntry(registry, Duck);

    registry.set({provide: Duck, useValue: 123});
    const entry2 = getEntry(registry, Duck);

    expect(entry1 === entry2).toBe(false);
    expect(registry.size).toBe(1);
    expect(getEntry(registry, Duck).useValue).toBe(123);
  });

  test(`noMulti. existed.length === 1, replace existed useValue #2`, () => {
    const registry = new Registry();

    registry.set({provide: Duck, useValue: null});
    const entry1 = getEntry(registry, Duck);

    registry.set({provide: Duck, deps: ['some'], useValue: 123});
    const entry2 = getEntry(registry, Duck);

    expect(entry1 === entry2).toBe(false);
    expect(registry.size).toBe(2);
    // expect(getEntry(registry, Duck).useValue).toBe(123);
  });

  test(`noMulti. existed.length > 1`, () => {
    const registry = new Registry();

    registry.set({provide: Duck, multi: true});
    expect(registry.size).toBe(1);

    registry.set({provide: Duck, useClass: Turkey, multi: true});
    expect(registry.size).toBe(1);

    expect(getEntries(registry, Duck).length).toBe(2);

    expect(() => registry.set({provide: Duck})).toThrow();
    expect(getEntries(registry, Duck).length).toBe(2);
  });

});
