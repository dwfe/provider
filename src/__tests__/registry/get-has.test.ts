import {describe, expect} from '@jest/globals';
import {checkCloned} from '../registry.entry/clone.test';
import {L10nService} from '../abc/l10n.service'
import {Entry, Registry} from '../../registry';
import {Duck, Turkey} from '../abc/bird';
import {getEntry} from './set.test';
import {User} from '../abc/user'

describe('Registry.get .has', () => {

  test('no entry', () => {
    const registry = new Registry();
    expect(registry.has(Duck)).toBe(false);
    expect(registry.get(Duck)).toBe(undefined);

    expect(registry.has(null)).toBe(false);
    expect(registry.get(null)).toBe(undefined);

    expect(registry.has(123)).toBe(false);
    expect(registry.get(123)).toBe(undefined);

    registry.set({provide: Duck});
    expect(registry.has(Duck)).toBe(true);
    expect(registry.has(Turkey)).toBe(false);
    expect(registry.get(Turkey)).toBe(undefined);
  });

  test('entry exists', () => {
    const registry = new Registry();
    registry.set({provide: Duck});
    let result = registry.get(Duck);
    expect(Array.isArray(result) && result.length === 1).toBe(true);
    expect(registry.size).toBe(1);

    registry.set({provide: 123, useClass: Duck});
    result = registry.get(123);
    expect(Array.isArray(result) && result.length === 1).toBe(true);
    expect(registry.size).toBe(2);
  });

  test('clone result arr', () => {
    const registry = new Registry();
    registry.set({provide: Duck});
    const result1 = registry.get(Duck);
    const result2 = registry.get(Duck);
    expect(Array.isArray(result1)).toBe(true);
    expect(Array.isArray(result2)).toBe(true);
    expect(result1 === result2).toBe(false);
  });

  test('second level filter [by deps]', () => {
    const registry = new Registry();
    registry.set({provide: Duck, multi: true});
    registry.set({provide: Duck, deps: [User], multi: true});
    registry.set({provide: Duck, deps: [123, L10nService], multi: true});

    expect(registry.get(Duck)?.length).toBe(3);
    expect(registry.get(Duck, [User])?.length).toBe(1);
    expect(registry.get(Duck, [123])?.length).toBe(undefined);
    expect(registry.get(Duck, [123, L10nService])?.length).toBe(1);
    expect(registry.get(Duck, [L10nService, 123])?.length).toBe(undefined);
    expect(registry.get(Duck, ['hello'])?.length).toBe(undefined);
  });

  test('entry must be cloned', () => {
    const registry = new Registry();
    registry.set({provide: Duck, deps: [Turkey, User]});
    getEntry(registry, Duck);

    const entry = registry['store'].get(Duck)?.[0] as Entry;
    const cloned = registry.get(Duck)?.[0] as Entry;
    checkCloned(entry, cloned);
  });

});
