import {describe, expect} from '@jest/globals';
import {ifArraysCheckEqual} from '../../registry/util'
import {Entry, IEntry} from '../../registry'
import {IEntryTest} from '../abc/contract'
import {Duck, Turkey} from '../abc/bird'
import {User} from '../abc/user'

function check(dto: IEntry, test: IEntryTest) {
  const entry = new Entry(dto);
  expect(entry.provide).toBe(test.provide);
  expect(entry.useClass).toBe(test.useClass);
  expect(entry.useFactory).toBe(test.useFactory);
  expect(ifArraysCheckEqual(entry.deps, test.deps)).toBe(true);
  expect(entry.useValue).toBe(test.useValue);
  expect(entry.multi).toBe(test.multi);
  expect(entry.isValueProvided).toBe(test.isValueProvided);
  expect(entry.isClassInstanceProvided).toBe(test.isClassInstanceProvided);
  expect(entry.isFactoryResultProvided).toBe(test.isFactoryResultProvided);
}

export const getLang = (user: User) => user?.lang || 'en';

describe(`normal use`, () => {

  test(`class instance provided`, () => {
    check(
      {provide: Duck},
      {provide: Duck, useClass: Duck, useFactory: undefined, deps: undefined, useValue: undefined, multi: false, isValueProvided: false, isClassInstanceProvided: true, isFactoryResultProvided: false});
    check(
      {provide: Duck, useClass: Duck},
      {provide: Duck, useClass: Duck, useFactory: undefined, deps: undefined, useValue: undefined, multi: false, isValueProvided: false, isClassInstanceProvided: true, isFactoryResultProvided: false});
    check(
      {provide: Duck, useClass: Duck, deps: ['quack!', Map]},
      {provide: Duck, useClass: Duck, useFactory: undefined, deps: ['quack!', Map], useValue: undefined, multi: false, isValueProvided: false, isClassInstanceProvided: true, isFactoryResultProvided: false});
    check(
      {provide: Turkey, useClass: Duck, deps: ['ololo!']},
      {provide: Turkey, useClass: Duck, useFactory: undefined, deps: ['ololo!'], useValue: undefined, multi: false, isValueProvided: false, isClassInstanceProvided: true, isFactoryResultProvided: false});
  });

  test(`factory result provided`, () => {
    check(
      {provide: 'lang', useFactory: getLang, deps: [User]},
      {provide: 'lang', useClass: undefined, useFactory: getLang, deps: [User], useValue: undefined, multi: false, isValueProvided: false, isClassInstanceProvided: false, isFactoryResultProvided: true});
  });

  test(`value provided`, () => {
    check(
      {provide: Duck, useValue: 123},
      {provide: Duck, useClass: undefined, useFactory: undefined, deps: undefined, useValue: 123, multi: false, isValueProvided: true, isClassInstanceProvided: false, isFactoryResultProvided: false});
    check(
      {provide: Turkey, useClass: Turkey, deps: ['ololo!'], useValue: 123},
      {provide: Turkey, useClass: undefined, useFactory: undefined, deps: undefined, useValue: 123, multi: false, isValueProvided: true, isClassInstanceProvided: false, isFactoryResultProvided: false});
  });

  test(`multiple provided`, () => {
    check(
      {provide: 'Bird', useClass: Duck, multi: true},
      {provide: 'Bird', useClass: Duck, useFactory: undefined, deps: undefined, useValue: undefined, multi: true, isValueProvided: false, isClassInstanceProvided: true, isFactoryResultProvided: false});
    check(
      {provide: 'Bird', useClass: Turkey, multi: true},
      {provide: 'Bird', useClass: Turkey, useFactory: undefined, deps: undefined, useValue: undefined, multi: true, isValueProvided: false, isClassInstanceProvided: true, isFactoryResultProvided: false});
    check(
      {provide: 'Bird', useValue: 'Eagle', multi: true},
      {provide: 'Bird', useClass: undefined, useFactory: undefined, deps: undefined, useValue: 'Eagle', multi: true, isValueProvided: true, isClassInstanceProvided: false, isFactoryResultProvided: false});
  });

  // test(``, () => {
  //   check(
  //     {provide: },
  //     {provide: , useClass: , useFactory: , deps: , useValue: , multi: , isValueProvided: , isClassInstanceProvided: , isFactoryResultProvided: });
  // });

});
