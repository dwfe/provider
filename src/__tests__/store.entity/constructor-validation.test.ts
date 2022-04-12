import {describe, expect} from '@jest/globals';
import {Entity, IEntity} from '../../store';
import {IEntityTest} from '../abc/contract'
import {User} from '../abc/user';
import {Duck} from '../abc/bird';

function toThrow(dto: IEntityTest, message: string) {
  try {
    new Entity(dto as IEntity);
  } catch (err) {
    expect(err).toBeInstanceOf(Error);
    expect(err).toHaveProperty('message', message);
    return;
  }
  expect('unreachable code section').toBe('but it came to this anyway');
}

function noThrow(dto: IEntityTest) {
  expect(() => new Entity(dto as IEntity)).not.toThrow();
}

describe(`Entity.constructor, incorrect use`, () => {

  test(`incorrect base`, () => {
    toThrow({}, 'Incorrect base');
    toThrow({base: null}, 'Incorrect base');
    toThrow({base: ''}, 'Incorrect base');
  });

  test(`incorrect deps`, () => {
    toThrow({base: User, deps: 'hello', value: 123}, 'Incorrect deps');
    noThrow({base: User, deps: [], value: 123});
    noThrow({base: User, deps: [Duck, null], value: 123});
  });

  test(`incorrect value`, () => {
    toThrow({base: User}, 'Incorrect value');
    noThrow({base: User, value: 123});
    noThrow({base: User, value: null});
  });

  // test(``, () => {
  //   toThrow({provide: });
  // });

});
