import {describe, expect} from '@jest/globals';
import {Template, ITemplate} from '../../registry';
import {Duck, Turkey} from '../abc/bird';
import {getLang} from './constructor-normalization.test';
import {User} from '../abc/user';

//region Support

function check(dto: ITemplate, props: Array<keyof ITemplate>) {
  const orig = new Template(dto).orig;
  expect(Object.keys(orig).length).toBe(props.length);
  for (const prop of props)
    expect(orig.hasOwnProperty(prop)).toBe(true);
}

//endregion Support

describe(`Entry.get-orig`, () => {

  test(`class instance provided`, () => {
    check(
      {provide: Duck},
      ['provide', 'useClass']);
    check(
      {provide: Duck, useClass: Duck},
      ['provide', 'useClass']);
    check(
      {provide: Duck, useClass: Duck, deps: ['quack!']},
      ['provide', 'useClass', 'deps']);
  });

  test(`factory result provided`, () => {
    check(
      {provide: 'lang', useFactory: getLang, deps: [User]},
      ['provide', 'useFactory', 'deps']);
  });

  test(`value provided`, () => {
    check(
      {provide: Duck, useValue: 123},
      ['provide', 'useValue']);
    check(
      {provide: Turkey, useClass: Turkey, deps: ['ololo!'], useValue: 123},
      ['provide', 'useValue', 'deps']);
  });

  test(`multiple provided`, () => {
    check(
      {provide: 'Bird', useClass: Duck, multi: true},
      ['provide', 'useClass', 'multi']);
    check(
      {provide: 'Bird', useValue: 'Eagle', multi: true},
      ['provide', 'useValue', 'multi']);
  });

});
