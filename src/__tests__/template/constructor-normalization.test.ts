import {describe, expect} from '@jest/globals';
import {ITemplate, Template} from '../../registry'
import {arraysEqualFailCheck} from '../../util'
import {ITemplateTest} from '../abc/contract'
import {Duck, Turkey} from '../abc/bird'
import {getLang} from '../abc/get-lang'
import {User} from '../abc/user'

//region Support

function check(dto: ITemplate, test: ITemplateTest) {
  const t = new Template(dto);
  expect(t.provide).toBe(test.provide);
  expect(t.useClass).toBe(test.useClass);
  expect(t.useFactory).toBe(test.useFactory);
  expect(arraysEqualFailCheck(t.deps, test.deps)).toBe(true);
  expect(t.multi).toBe(test.multi);
  expect(t.expected).toBe(test.expected);
}

//endregion Support

describe(`Template.constructor, normal use`, () => {

  test(`class instance provided`, () => {
    check(
      {provide: Duck},
      {provide: Duck, useClass: Duck, useFactory: undefined, deps: undefined, multi: false, expected: 'instance'});
    check(
      {provide: Duck, useClass: Duck},
      {provide: Duck, useClass: Duck, useFactory: undefined, deps: undefined, multi: false, expected: 'instance'});
    check(
      {provide: Duck, useClass: Duck, deps: ['quack!', Map]},
      {provide: Duck, useClass: Duck, useFactory: undefined, deps: ['quack!', Map], multi: false, expected: 'instance'});
    check(
      {provide: Duck, useClass: Duck, deps: []},
      {provide: Duck, useClass: Duck, useFactory: undefined, deps: undefined, multi: false, expected: 'instance'});
    check(
      {provide: Turkey, useClass: Duck, deps: ['ololo!']},
      {provide: Turkey, useClass: Duck, useFactory: undefined, deps: ['ololo!'], multi: false, expected: 'instance'});
  });

  test(`factory result provided`, () => {
    check(
      {provide: 'lang', useFactory: getLang, deps: [User]},
      {provide: 'lang', useClass: undefined, useFactory: getLang, deps: [User], multi: false, expected: 'factory-result'});
    check(
      {provide: 'lang', useFactory: getLang, deps: []},
      {provide: 'lang', useClass: undefined, useFactory: getLang, deps: undefined, multi: false, expected: 'factory-result'});
  });

  test(`multiple provided`, () => {
    check(
      {provide: 'Bird', useClass: Duck, multi: true},
      {provide: 'Bird', useClass: Duck, useFactory: undefined, deps: undefined, multi: true, expected: 'instance'});
    check(
      {provide: 'Bird', useClass: Turkey, multi: true},
      {provide: 'Bird', useClass: Turkey, useFactory: undefined, deps: undefined, multi: true, expected: 'instance'});
    check(
      {provide: 'Bird', useFactory: getLang, multi: true},
      {provide: 'Bird', useClass: undefined, useFactory: getLang, deps: undefined, multi: true, expected: 'factory-result'});
  });

  // test(``, () => {
  //   check(
  //     {provide: },
  //     {provide: , useClass: , useFactory: , deps: , useValue: , multi: , expected: ''});
  // });

});
