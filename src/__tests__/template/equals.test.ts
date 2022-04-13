import {describe, expect} from '@jest/globals';
import {Template, ITemplate} from '../../registry'
import {Duck, Turkey} from '../abc/bird'
import {getLang} from '../abc/get-lang'
import {User} from '../abc/user';

//region Support

function truthy(a: ITemplate, b = {...a}) {
  expect(new Template(a).equals(new Template(b))).toBe(true)
}

function falsy(a: ITemplate, b = {...a}) {
  expect(new Template(a).equals(new Template(b))).toBe(false)
}

//endregion Support

describe(`Template.equals`, () => {

  test(`class instance provided`, () => {
    truthy({provide: Duck});
    truthy({provide: Duck, useClass: Duck});
    truthy({provide: Duck}, {provide: Duck, useClass: Duck});
    truthy({provide: Duck, useClass: Duck, deps: ['quack!']});
    truthy({provide: Duck, useClass: Duck, deps: []});
    truthy(
      {provide: Duck, useClass: Duck, deps: []},
      {provide: Duck, useClass: Duck, deps: undefined});
    truthy({provide: Duck, useClass: Duck, deps: [null, User]});
    truthy({provide: Turkey, useClass: Duck, deps: ['ololo!']});
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

  test(`factory result provided`, () => {
    truthy({provide: 'lang', useFactory: getLang, deps: [User]});
    falsy(
      {provide: 'lang', useFactory: () => true, deps: [User]},
      {provide: 'lang', useFactory: () => true, deps: [User]}
    )
  });

  test(`multiple provided`, () => {
    truthy({provide: 'Bird', useClass: Duck, multi: true});
    truthy({provide: 'Bird', useClass: Turkey, multi: true});
    truthy(
      {provide: 'Bird', useClass: Duck, multi: true},
      {provide: 'Bird', useClass: Duck, multi: true, deps: []});
    falsy(
      {provide: 'Bird', useClass: Duck},
      {provide: 'Bird', useClass: Duck, multi: true});
    falsy(
      {provide: 'Bird', useFactory: getLang, multi: false},
      {provide: 'Bird', useFactory: getLang, multi: true});
  });

});
