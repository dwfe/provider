import {describe, expect} from '@jest/globals';
import {Entity, IEntity} from '../../store'
import {Duck, Turkey} from '../abc/bird'

function truthy(a: IEntity, b = {...a}) {
  expect(new Entity(a).equals(new Entity(b))).toBe(true)
}

function falsy(a: IEntity, b = {...a}) {
  expect(new Entity(a).equals(new Entity(b))).toBe(false)
}

const duck = new Duck('quack!');
const turkey = new Turkey('ololo!');

describe(`Entity.equals`, () => {

  test(`test`, () => {
    truthy({base: Duck, value: duck});
    truthy({base: Duck, deps: [], value: duck});
    truthy({base: Duck, deps: [Number], value: null});
    truthy(
      {base: Duck, deps: [], value: duck},
      {base: Duck, deps: [], value: turkey});
    truthy(
      {base: Duck, value: duck},
      {base: Duck, value: turkey});
    truthy(
      {base: Duck, deps: [String], value: duck},
      {base: Duck, deps: [String], value: turkey});

    falsy(
      {base: Duck, value: duck},
      {base: Duck, deps: [String], value: duck});
    falsy(
      {base: Duck, deps: [String], value: duck},
      {base: Turkey, deps: [String], value: duck});
    falsy(
      {base: Duck, deps: [Number], value: duck},
      {base: Duck, deps: [String], value: duck});
    falsy(
      {base: Duck, deps: [Number], value: duck},
      {base: Turkey, deps: [String], value: duck});
  });

});
