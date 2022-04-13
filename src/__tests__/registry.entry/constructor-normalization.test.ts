import {describe, expect} from '@jest/globals';
import {arraysEqualFailCheck} from '../../util'
import {Template, ITemplate} from '../../registry'
import {IEntryTest} from '../abc/contract'
import {Duck, Turkey} from '../abc/bird'
import {User} from '../abc/user'

//region Support

function check(dto: ITemplate, test: IEntryTest) {
  const entry = new Template(dto);
  expect(entry.provide).toBe(test.provide);
  expect(entry.useClass).toBe(test.useClass);
  expect(entry.useFactory).toBe(test.useFactory);
  expect(arraysEqualFailCheck(entry.deps, test.deps)).toBe(true);
  expect(entry.useValue).toBe(test.useValue);
  expect(entry.multi).toBe(test.multi);
  expect(entry.expected).toBe(test.expected);
}

export const getLang = (user: User) => user?.lang || 'en';

//endregion Support

describe(`Entry.constructor, normal use`, () => {

  test(`class instance provided`, () => {
    check(
      {provide: Duck},
      {provide: Duck, useClass: Duck, useFactory: undefined, deps: undefined, useValue: undefined, multi: false, expected: 'instance'});
    check(
      {provide: Duck, useClass: Duck},
      {provide: Duck, useClass: Duck, useFactory: undefined, deps: undefined, useValue: undefined, multi: false, expected: 'instance'});
    check(
      {provide: Duck, useClass: Duck, deps: ['quack!', Map]},
      {provide: Duck, useClass: Duck, useFactory: undefined, deps: ['quack!', Map], useValue: undefined, multi: false, expected: 'instance'});
    check(
      {provide: Turkey, useClass: Duck, deps: ['ololo!']},
      {provide: Turkey, useClass: Duck, useFactory: undefined, deps: ['ololo!'], useValue: undefined, multi: false, expected: 'instance'});
  });

  test(`factory result provided`, () => {
    check(
      {provide: 'lang', useFactory: getLang, deps: [User]},
      {provide: 'lang', useClass: undefined, useFactory: getLang, deps: [User], useValue: undefined, multi: false, expected: 'factory-result'});
  });

  test(`value provided`, () => {
    check(
      {provide: Duck, useValue: 123},
      {provide: Duck, useClass: undefined, useFactory: undefined, deps: undefined, useValue: 123, multi: false, expected: 'value'});
    check(
      {provide: Turkey, useClass: Turkey, deps: ['ololo!'], useValue: 123},
      {provide: Turkey, useClass: undefined, useFactory: undefined, deps: ['ololo!'], useValue: 123, multi: false, expected: 'value'});
  });

  test(`multiple provided`, () => {
    check(
      {provide: 'Bird', useClass: Duck, multi: true},
      {provide: 'Bird', useClass: Duck, useFactory: undefined, deps: undefined, useValue: undefined, multi: true, expected: 'instance'});
    check(
      {provide: 'Bird', useClass: Turkey, multi: true},
      {provide: 'Bird', useClass: Turkey, useFactory: undefined, deps: undefined, useValue: undefined, multi: true, expected: 'instance'});
    check(
      {provide: 'Bird', useValue: 'Eagle', multi: true},
      {provide: 'Bird', useClass: undefined, useFactory: undefined, deps: undefined, useValue: 'Eagle', multi: true, expected: 'value'});
  });

  // test(``, () => {
  //   check(
  //     {provide: },
  //     {provide: , useClass: , useFactory: , deps: , useValue: , multi: , expected: ''});
  // });

});
