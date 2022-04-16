import {describe, expect} from '@jest/globals';
import {L10nService} from '../abc/l10n.service';
import {Entry, Registry} from '../../registry';
import {Duck, Turkey} from '../abc/bird';
import {getLang} from '../abc/getLang'
import {User} from '../abc/user';

//region Support

export function getEntry(registry: Registry, provide: any): Entry {
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
  expect(result.every(x => x.multi)).toBe(true);
  expect(result.every(x => x.provide === provide)).toBe(true);
  return result;
}

//endregion Support

describe('Registry.set', () => {

  test('Entry | IEntry', () => {
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

  test('no existing entries', () => {
    const registry = new Registry();
    expect(registry.size).toBe(0);

    registry.set({provide: Duck});
    expect(registry.size).toBe(1);
    getEntry(registry, Duck);
    expect(registry.size).toBe(1);
  });

  test('multi. disable add multi if has non-multi', () => {
    const registry = new Registry();

    registry.set({provide: Duck});
    expect(() => registry.set({provide: Duck, multi: true})).toThrow();
    expect(registry.size).toBe(1);
    expect(getEntry(registry, Duck).multi).toBe(false);
  });

  test('multi. duplicate', () => {
    const registry = new Registry();

    registry.set({provide: Duck, multi: true});
    expect(registry.size).toBe(1);

    registry.set({provide: Duck, multi: true});
    expect(registry.size).toBe(1);
    getEntry(registry, Duck);

    registry.set({provide: Turkey, useFactory: getLang, multi: true});
    expect(registry.size).toBe(2);

    registry.set({provide: Turkey, useFactory: getLang, multi: true});
    expect(registry.size).toBe(2);
    getEntry(registry, Turkey);

    registry.set({provide: 'Turkey', useValue: getLang, multi: true});
    expect(registry.size).toBe(3);

    registry.set({provide: 'Turkey', useValue: getLang, multi: true});
    expect(registry.size).toBe(3);
    getEntry(registry, 'Turkey');
  });

  test('multi. add one more, useClass', () => {
    const registry = new Registry();

    registry.set({provide: Duck, multi: true});
    expect(registry.size).toBe(1);

    registry.set({provide: Duck, useClass: Turkey, multi: true});
    expect(registry.size).toBe(1);

    expect(getEntries(registry, Duck).length).toBe(2);
  });

  test('multi. add one more, useFactory', () => {
    const registry = new Registry();

    registry.set({provide: Turkey, useFactory: getLang, multi: true});
    expect(registry.size).toBe(1);

    registry.set({provide: Turkey, useFactory: () => 'ok', multi: true});
    expect(registry.size).toBe(1);

    expect(getEntries(registry, Turkey).length).toBe(2);
  });

  test('multi. add one more, useValue', () => {
    const registry = new Registry();

    registry.set({provide: User, useValue: 123, multi: true});
    expect(registry.size).toBe(1);

    registry.set({provide: User, useValue: 123, multi: true});
    expect(registry.size).toBe(1);
    getEntry(registry, User);

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

  test('noMulti. existed.length === 0', () => {
    const registry = new Registry();

    registry.set({provide: Duck});
    expect(registry.size).toBe(1);

    const values = registry['store'].get(Duck) as Array<any>;
    values.length = 0;
    expect(registry.size).toBe(1);

    registry.set({provide: Duck});
    expect(registry.size).toBe(1);

    getEntry(registry, Duck);
  });

  test('noMulti. existed.length === 1, do not replace identical one', () => {
    const registry = new Registry();

    registry.set({provide: Duck});
    const entry1 = getEntry(registry, Duck);

    registry.set({provide: Duck});
    const entry2 = getEntry(registry, Duck);

    expect(entry1.equals(entry2)).toBe(true);
    expect(registry.size).toBe(1);

    registry.set({provide: Duck, useValue: 123});
    const entry3 = getEntry(registry, Duck);

    registry.set({provide: Duck, useValue: 123});
    const entry4 = getEntry(registry, Duck);

    expect(entry3.equals(entry4)).toBe(true);
    expect(registry.size).toBe(1);
  });

  test('noMulti. existed.length === 1, disable replace multi with non-multi', () => {
    const registry = new Registry();

    registry.set({provide: Duck, multi: true});
    expect(registry.size).toBe(1);
    const entry1 = getEntry(registry, Duck);

    registry.set({provide: Duck, multi: false});
    expect(registry.size).toBe(1);
    const entry2 = getEntry(registry, Duck);

    expect(entry2.multi).toBe(true);
    expect(entry1.equals(entry2)).toBe(true);
    expect(registry.size).toBe(1);
  });

  test('noMulti. existed.length === 1, replace existed', () => {
    const registry = new Registry();

    registry.set({provide: Duck});
    const entry1 = getEntry(registry, Duck);

    registry.set({provide: Duck, useClass: Turkey});
    const entry2 = getEntry(registry, Duck);
    expect(entry1 !== entry2).toBe(true);
    expect(entry2).toHaveProperty('useClass', Turkey);
    expect(registry.size).toBe(1);

    registry.set({provide: Duck, useFactory: Turkey});
    const entry3 = getEntry(registry, Duck);
    expect(entry2 !== entry3).toBe(true);
    expect(entry3).toHaveProperty('useFactory', Turkey);
    expect(registry.size).toBe(1);

    registry.set({provide: Duck, useValue: getLang});
    const entry4 = getEntry(registry, Duck);
    expect(entry3 !== entry4).toBe(true);
    expect(entry4).toHaveProperty('useValue', getLang);
    expect(registry.size).toBe(1);
  });

  test('noMulti. existed.length === 1, replace existed useValue #1', () => {
    const registry = new Registry();

    registry.set({provide: Duck, useValue: null});
    const entry1 = getEntry(registry, Duck);

    registry.set({provide: Duck, useValue: 123});
    const entry2 = getEntry(registry, Duck);

    expect(entry1 !== entry2).toBe(true);
    expect(registry.size).toBe(1);
    expect(getEntry(registry, Duck).useValue).toBe(123);
  });

  test('noMulti. existed.length > 1', () => {
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
