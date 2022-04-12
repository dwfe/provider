import {describe, expect} from '@jest/globals';
import {Entity, IEntity} from '../../store'
import {Duck} from '../abc/bird';

function check(dto: IEntity, props: Array<keyof IEntity>) {
  const orig = new Entity(dto).orig;
  expect(Object.keys(orig).length).toBe(props.length);
  for (const prop of props)
    expect(orig.hasOwnProperty(prop)).toBe(true);
}

const duck = new Duck('quack!');

describe(`Entity.orig`, () => {

  test(`test`, () => {
    check(
      {base: Duck, value: duck},
      ['base', 'deps', 'value']);
    check(
      {base: Duck, deps: [], value: duck},
      ['base', 'deps', 'value']);
    check(
      {base: Duck, deps: [String], value: duck},
      ['base', 'deps', 'value']);
  });

});
