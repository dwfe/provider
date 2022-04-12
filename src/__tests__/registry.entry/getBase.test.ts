import {describe, expect} from '@jest/globals';
import {Entry, IEntry} from '../../registry';
import {Duck, Turkey} from '../abc/bird';
import {getLang} from './constructor-normalization.test';
import {User} from '../abc/user';

function check(dto: IEntry, props: Array<keyof IEntry>) {
  const base = new Entry(dto).base;
  expect(Object.keys(base).length).toBe(props.length);
  for (const prop of props)
    expect(base.hasOwnProperty(prop)).toBe(true);
}

describe(`Entry.base`, () => {

  test(`class instance provided`, () => {
    check(
      {provide: Duck},
      ['provide', 'useClass', 'multi']);
    check(
      {provide: Duck, useClass: Duck},
      ['provide', 'useClass', 'multi']);
    check(
      {provide: Duck, useClass: Duck, deps: ['quack!']},
      ['provide', 'useClass', 'deps', 'multi']);
  });

  test(`factory result provided`, () => {
    check(
      {provide: 'lang', useFactory: getLang, deps: [User]},
      ['provide', 'useFactory', 'deps', 'multi']);
  });

  test(`value provided`, () => {
    check(
      {provide: Duck, useValue: 123},
      ['provide', 'useValue', 'multi']);
    check(
      {provide: Turkey, useClass: Turkey, deps: ['ololo!'], useValue: 123},
      ['provide', 'useValue', 'multi']);
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
