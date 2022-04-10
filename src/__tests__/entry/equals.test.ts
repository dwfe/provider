import {describe, expect} from '@jest/globals';
import {Entry, IEntry} from '../../registry'
import {Duck} from '../abc/bird'

function check(entry: IEntry) {
  expect(new Entry(entry).equals(new Entry(entry))).toBe(true)
}

describe(`equals`, () => {

  test(``, () => {
    check({provide: Duck});
  });

});
