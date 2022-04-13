import {describe, expect} from '@jest/globals';
import {Template, ITemplate} from '../../registry'
import {ITemplateTest} from '../abc/contract'
import {Duck, Turkey} from '../abc/bird'
import {getLang} from '../abc/get-lang'
import {User} from '../abc/user'

//region Support

function toThrow(dto: ITemplateTest, message: string) {
  try {
    new Template(dto as ITemplate);
  } catch (err) {
    expect(err).toBeInstanceOf(Error);
    expect(err).toHaveProperty('message', message);
    return;
  }
  expect('unreachable code section').toBe('but it came to this anyway');
}

function noThrow(dto: ITemplateTest) {
  expect(() => new Template(dto as ITemplate)).not.toThrow();
}

//endregion Support

describe(`Template.constructor, incorrect use`, () => {

  test(`incorrect provide`, () => {
    toThrow({}, `Incorrect "provide"`);
    toThrow({provide: null}, `Incorrect "provide"`);
    toThrow({provide: 'Bird'}, `Incorrect template with primitive type of "provide"`);
    toThrow({provide: false}, `Incorrect template with primitive type of "provide"`);
    noThrow({provide: false, useClass: Duck});
    noThrow({provide: true, useFactory: getLang});
    noThrow({provide: 123, useClass: Duck});
    noThrow({provide: 73n, useClass: Duck});
    noThrow({provide: 'token', useClass: Turkey});
    noThrow({provide: Symbol(), useClass: Turkey});
  });

  test(`only one: useClass or useFactory`, () => {
    toThrow({provide: Duck, useClass: Duck, useFactory: getLang}, `Only one: "useClass" or "useFactory"`);
  });

  test(`incorrect useFactory`, () => {
    toThrow({provide: Duck, useFactory: 123}, `Incorrect "useFactory"`);
  });

  test(`incorrect useClass`, () => {
    toThrow({provide: Duck, useClass: 123}, `Incorrect "useClass"`);
    noThrow({provide: Duck});
  });

  test(`incorrect deps`, () => {
    toThrow({provide: Duck, deps: null}, `Incorrect "deps"`);
    toThrow({provide: Duck, deps: 123}, `Incorrect "deps"`);
    noThrow({provide: Duck, deps: []});
    noThrow({provide: Duck, deps: [123]});
    noThrow({provide: Duck, deps: [User, 123]});
  });

  // test(``, () => {
  //   toThrow({provide: });
  // });

});
