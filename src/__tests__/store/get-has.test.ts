import {describe, expect} from '@jest/globals';
import {Store} from '../../store'
import {Duck} from '../abc/bird'

describe(`Store.get .has`, () => {

  test(`no entry`, () => {
    const store = new Store();
    expect(store.has(Duck)).toBe(false);
    expect(store.get(Duck)).toBe(undefined);

  });

  test(`entry exists`, () => {
    const store = new Store();

  });

});
