import {describe, expect} from '@jest/globals';
import {getLang} from './constructor-normalization.test'
import {Entry, IEntry} from '../../registry'
import {IEntryTest} from '../abc/contract'
import {Duck} from '../abc/bird'

function check(dto: IEntryTest) {
  expect(() => new Entry(dto as IEntry)).toThrow();
}

describe(`Entry.constructor, incorrect use`, () => {

  test(`incorrect provide`, () => {
    check({});
  });

  test(`only useClass or only useFactory`, () => {
    check({provide: Duck, useClass: Duck, useFactory: getLang});
  });

  test(`incorrect useClass`, () => {
    check({provide: Duck, useClass: 123});
  });

  test(`incorrect useFactory`, () => {
    check({provide: Duck, useFactory: 123});
  });

  test(`incorrect deps`, () => {
    check({provide: Duck, deps: null});
    check({provide: Duck, deps: 123});
  });

  // test(``, () => {
  //   check({provide: });
  // });

});
