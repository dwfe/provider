import {describe, expect} from '@jest/globals';
import {ifArraysCheckEqual} from '../../registry/util'
import {Entry, IEntry} from '../../registry'
import {IEntryTest} from '../abc/contract'
import {Duck, Turkey} from '../abc/bird'

function check(dto: IEntry, test: IEntryTest) {
  const entry = new Entry(dto);
  expect(entry.provide).toBe(test.provide);
  expect(entry.useClass).toBe(test.useClass);
  expect(ifArraysCheckEqual(entry.deps, test.deps)).toBe(true);
  expect(entry.useValue).toBe(test.useValue);
  expect(entry.multi).toBe(test.multi);
  expect(entry.isValueProvided).toBe(test.isValueProvided);
  expect(entry.isClassProvided).toBe(test.isClassProvided);
}

describe(`tests`, () => {

  test(`normal use`, () => {

    check(
      {provide: Duck},
      {provide: Duck, useClass: Duck, deps: undefined, useValue: undefined, multi: false, isValueProvided: false, isClassProvided: true});
    check(
      {provide: Duck, useClass: Duck},
      {provide: Duck, useClass: Duck, deps: undefined, useValue: undefined, multi: false, isValueProvided: false, isClassProvided: true});
    check(
      {provide: Duck, useClass: Duck, deps: ['quack!', Map]},
      {provide: Duck, useClass: Duck, deps: ['quack!', Map], useValue: undefined, multi: false, isValueProvided: false, isClassProvided: true});
    check(
      {provide: Turkey, useClass: Duck, deps: ['ololo!']},
      {provide: Turkey, useClass: Duck, deps: ['ololo!'], useValue: undefined, multi: false, isValueProvided: false, isClassProvided: true});
    check(
      {provide: Duck, useValue: 123},
      {provide: Duck, useClass: undefined, deps: undefined, useValue: 123, multi: false, isValueProvided: true, isClassProvided: false});
    check(
      {provide: Turkey, useClass: Turkey, deps: ['ololo!'], useValue: 123},
      {provide: Turkey, useClass: undefined, deps: undefined, useValue: 123, multi: false, isValueProvided: true, isClassProvided: false});
    check(
      {provide: 'Bird', useClass: Duck, multi: true},
      {provide: 'Bird', useClass: Duck, deps: undefined, useValue: undefined, multi: true, isValueProvided: false, isClassProvided: true});
    check(
      {provide: 'Bird', useValue: 'Eagle', multi: true},
      {provide: 'Bird', useClass: undefined, deps: undefined, useValue: 'Eagle', multi: true, isValueProvided: true, isClassProvided: false});

    // check(
    //   {provide: },
    //   {provide: , useClass: , deps: , useValue: , multi: , isValueProvided: , isClassProvided: });

  });

  // test(``, () => {});

});
