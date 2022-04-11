import {describe, expect} from '@jest/globals';
import {getLang} from './constructor-normalization.test'
import {Entry, IEntry} from '../../registry'
import {IEntryTest} from '../abc/contract'
import {Duck} from '../abc/bird'
import {User} from '../abc/user'

function toThrow(dto: IEntryTest) {
  expect(() => new Entry(dto as IEntry)).toThrow();
}

function noThrow(dto: IEntryTest) {
  expect(() => new Entry(dto as IEntry)).not.toThrow();
}

describe(`Entry.constructor, incorrect use`, () => {

  test(`incorrect provide`, () => {
    toThrow({});
  });

  test(`only useClass or only useFactory`, () => {
    toThrow({provide: Duck, useClass: Duck, useFactory: getLang});
  });

  test(`incorrect useClass`, () => {
    toThrow({provide: Duck, useClass: 123});
  });

  test(`incorrect useFactory`, () => {
    toThrow({provide: Duck, useFactory: 123});
  });

  test(`incorrect deps`, () => {
    toThrow({provide: Duck, deps: null});
    toThrow({provide: Duck, deps: 123});
    noThrow({provide: Duck, deps: []});
    noThrow({provide: Duck, deps: [123]});
    noThrow({provide: Duck, deps: [User, 123]});
  });

  // test(``, () => {
  //   toThrow({provide: });
  // });

});
