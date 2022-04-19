import {describe} from '@jest/globals';
import {Entry, IEntry} from '../../registry'
import {IEntryTest} from '../abc/contract'
import {Duck, Turkey} from '../abc/bird'
import {noThrow, toThrow} from '../util'
import {getLang} from '../abc/getLang';
import {User} from '../abc/user'

//region Support

function create(dto: IEntryTest) {
  return () => new Entry(dto as IEntry);
}

//endregion Support

describe('Entry.constructor, incorrect use', () => {

  test('incorrect provide', () => {
    toThrow(create({}), 'Incorrect "provide"');
    toThrow(create({provide: null}), 'Incorrect "provide"');
    toThrow(create({provide: 'Bird'}), 'Incorrect entry when "provide" is a primitive');
    noThrow(create({provide: false, useClass: Duck}));
    noThrow(create({provide: true, useFactory: getLang}));
    noThrow(create({provide: 123, useClass: Duck}));
    noThrow(create({provide: 73n, useClass: Duck}));
    noThrow(create({provide: 'token', useValue: Turkey}));
    noThrow(create({provide: Symbol(), useValue: 'en'}));
  });

  test('only one: useClass or useFactory', () => {
    toThrow(create({provide: Duck, useClass: Duck, useFactory: getLang}), 'Only one: "useClass" or "useFactory"');
  });

  test('incorrect useFactory', () => {
    toThrow(create({provide: Duck, useFactory: 123}), 'Incorrect "useFactory"');
  });

  test('incorrect useClass', () => {
    toThrow(create({provide: Duck, useClass: 123}), 'Incorrect "useClass"');
  });

  test('incorrect provide, must be a function', () => {
    toThrow(create({provide: {say: 'hi'}}), 'Incorrect "provide". Must be a function')
  });

  test('incorrect deps', () => {
    toThrow(create({provide: Duck, deps: null}), 'Incorrect "deps"');
    toThrow(create({provide: Duck, deps: 123}), 'Incorrect "deps"');
    noThrow(create({provide: Duck, deps: []}));
    noThrow(create({provide: Duck, deps: [123]}));
    noThrow(create({provide: Duck, deps: [User, 123]}));
  });

});
