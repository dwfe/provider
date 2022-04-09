import {describe, expect} from '@jest/globals';
import * as console2 from 'console';
import {IEntryTest} from '../abc/contract'
import {Duck} from '../abc/bird'
import {Entry, IEntry} from '../../registry'
import {ifArraysCheckEqual} from '../../registry/util'

global.console = console2;

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

  test(`обычное использование`, () => {

    check(
      {provide: Duck},
      {provide: Duck, useClass: Duck, deps: undefined, useValue: undefined, multi: false, isValueProvided: false, isClassProvided: true});
    check(
      {provide: Duck, useClass: Duck},
      {provide: Duck, useClass: Duck, deps: undefined, useValue: undefined, multi: false, isValueProvided: false, isClassProvided: true});
    check(
      {provide: Duck, useClass: Duck, deps: ['quack!', Map]},
      {provide: Duck, useClass: Duck, deps: ['quack!', Map], useValue: undefined, multi: false, isValueProvided: false, isClassProvided: true});
    // check(
    //   {provide: },
    //   {provide: , useClass: , deps: , useValue: , multi: , isValueProvided: , isClassProvided: });

    // check(
    //   {provide: },
    //   {provide: , useClass: , deps: , useValue: , multi: , isValueProvided: , isClassProvided: });

  });

  // test(``, () => {});

});
