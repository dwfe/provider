import {describe, expect} from '@jest/globals';
import {arraysEqualStrictCheck} from '../../util'
import {Value, IValue} from '../../registry'
import {IEntityTest} from '../abc/contract'
import {User} from '../abc/user'

function check(dto: IValue, test: IEntityTest) {
  const entry = new Value(dto);
  expect(entry.provide).toBe(test.provide);
  expect(arraysEqualStrictCheck(entry.deps, test.deps)).toBe(true);
  expect(entry.useValue).toBe(test.useValue);
}

const user = new User();

describe(`Entity.constructor, normal use`, () => {

  test(`class instance provided`, () => {
    check(
      {base: User, value: user},
      {base: User, deps: [], value: user});
    check(
      {base: User, deps: [123, null], value: user},
      {base: User, deps: [123, null], value: user});
  });

});
