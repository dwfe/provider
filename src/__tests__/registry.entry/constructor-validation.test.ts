import {describe, expect} from '@jest/globals';
import {Entry, IEntry} from '../../registry'
import {IEntryTest} from '../abc/contract'
import {Duck, Turkey} from '../abc/bird'
import {getLang} from '../abc/get-lang';
import {User} from '../abc/user'

//region Support

function toThrow(dto: IEntryTest, message: string) {
  try {
    new Entry(dto as IEntry);
  } catch (err) {
    expect(err).toBeInstanceOf(Error);
    expect(err).toHaveProperty('message', message);
    return;
  }
  expect('unreachable code section').toBe('but it came to this anyway');
}

function noThrow(dto: IEntryTest) {
  expect(() => new Entry(dto as IEntry)).not.toThrow();
}

//endregion Support

describe('Entry.constructor, incorrect use', () => {

  test('incorrect provide', () => {
    toThrow({}, 'Incorrect "provide"');
    toThrow({provide: null}, 'Incorrect "provide"');
    toThrow({provide: 'Bird'}, 'Incorrect entry when "provide" is a primitive');
    noThrow({provide: false, useClass: Duck});
    noThrow({provide: true, useFactory: getLang});
    noThrow({provide: 123, useClass: Duck});
    noThrow({provide: 73n, useClass: Duck});
    noThrow({provide: 'token', useValue: Turkey});
    noThrow({provide: Symbol(), useValue: 'en'});
  });

  test('only one: useClass or useFactory', () => {
    toThrow({provide: Duck, useClass: Duck, useFactory: getLang}, 'Only one: "useClass" or "useFactory"');
  });

  test('incorrect useFactory', () => {
    toThrow({provide: Duck, useFactory: 123}, 'Incorrect "useFactory"');
  });

  test('incorrect useClass', () => {
    toThrow({provide: Duck, useClass: 123}, 'Incorrect "useClass"');
  });

  test('incorrect deps', () => {
    toThrow({provide: Duck, deps: null}, 'Incorrect "deps"');
    toThrow({provide: Duck, deps: 123}, 'Incorrect "deps"');
    noThrow({provide: Duck, deps: []});
    noThrow({provide: Duck, deps: [123]});
    noThrow({provide: Duck, deps: [User, 123]});
  });

  // test(``, () => {
  //   toThrow({provide: });
  // });

});
