import {describe, expect} from '@jest/globals';
import {Entry, IEntry} from '../../registry'
import {Duck, Turkey} from '../abc/bird'
import {getLang} from '../abc/getLang';
import {User} from '../abc/user';

//region Support

function truthy(a: IEntry, b = {...a}) {
  expect(new Entry(a).equals(new Entry(b))).toBe(true)
}

function falsy(a: IEntry, b = {...a}) {
  expect(new Entry(a).equals(new Entry(b))).toBe(false)
}

//endregion Support

describe('Entry.equals', () => {

  test('class instance provided', () => {
    truthy({provide: Duck});
    truthy({provide: Duck, useClass: Duck});
    truthy({provide: Duck}, {provide: Duck, useClass: Duck});
    truthy({provide: Duck, useClass: Duck, deps: ['quack!']});
    truthy({provide: Duck, useClass: Duck, deps: []});
    truthy({provide: Duck, useClass: Duck, deps: [null, User]});
    truthy({provide: Turkey, useClass: Duck, deps: ['ololo!']});
    truthy(
      {provide: Turkey, useClass: Duck},
      {provide: Turkey, useClass: Duck, deps: []});
    falsy(
      {provide: Duck},
      {provide: Turkey});
    falsy(
      {provide: Duck, useClass: Duck},
      {provide: Duck, useClass: Duck, deps: ['quack!']});
    falsy(
      {provide: Duck, useClass: Duck, deps: ['quack!', User]},
      {provide: Duck, useClass: Duck, deps: ['quack!']});
    falsy(
      {provide: Duck, useClass: Duck, deps: []},
      {provide: Duck, useClass: Duck, deps: ['quack!']});
    falsy(
      {provide: Duck, useClass: Duck},
      {provide: Duck, useClass: Duck, deps: ['quack!']});
  });

  test('factory result provided', () => {
    truthy({provide: 'lang', useFactory: getLang, deps: [User]});
    falsy(
      {provide: 'lang', useFactory: getLang, deps: [User]},
      {provide: 'lang', useFactory: getLang});
    falsy(
      {provide: 'lang', useFactory: () => true, deps: [User]},
      {provide: 'lang', useFactory: () => true, deps: [User]}
    )
  });

  test('value provided', () => {
    truthy({provide: Duck, useValue: 123});
    truthy(
      {provide: Turkey, useClass: Turkey, useFactory: getLang, deps: ['ololo!'], useValue: 123},
      {provide: Turkey, useValue: 123});
    falsy(
      {provide: Duck},
      {provide: Duck, useValue: 123});
    falsy(
      {provide: Duck, useFactory: getLang},
      {provide: Duck, useValue: 123});
    falsy(
      {provide: Duck, useValue: null},
      {provide: Duck, useValue: 123});
    falsy(
      {provide: Duck, useValue: User},
      {provide: Turkey, useValue: User});
  });

  test('multiple provided', () => {
    truthy({provide: 'Bird', useClass: Duck, multi: true});
    truthy({provide: 'Bird', useValue: 'Eagle', multi: true});
    falsy(
      {provide: 'Bird', useClass: Duck},
      {provide: 'Bird', useClass: Duck, multi: true});
    truthy(
      {provide: 'Bird', useClass: Duck, multi: true},
      {provide: 'Bird', useClass: Duck, multi: true, deps: []});
    falsy(
      {provide: 'Bird', useValue: 'Eagle', multi: false},
      {provide: 'Bird', useValue: 'Eagle', multi: true});
  });

});
