import {describe, expect} from '@jest/globals';
import {Template, ITemplate} from '../../registry';
import {getLang} from '../abc/get-lang'
import {Duck} from '../abc/bird';
import {User} from '../abc/user';

//region Support

function check(dto: ITemplate, props: Array<keyof ITemplate>) {
  const orig = new Template(dto).orig;
  expect(Object.keys(orig).length).toBe(props.length);
  for (const prop of props)
    expect(orig.hasOwnProperty(prop)).toBe(true);
}

//endregion Support

describe(`Template.get-orig`, () => {

  test(`class instance provided`, () => {
    check(
      {provide: Duck},
      ['provide', 'useClass']);
    check(
      {provide: Duck, useClass: Duck},
      ['provide', 'useClass']);
    check(
      {provide: Duck, useClass: Duck, deps: ['quack!']},
      ['provide', 'useClass', 'deps']);
  });

  test(`factory result provided`, () => {
    check(
      {provide: 'lang', useFactory: getLang, deps: [User]},
      ['provide', 'useFactory', 'deps']);
  });

  test(`multiple provided`, () => {
    check(
      {provide: 'Bird', useClass: Duck, multi: true},
      ['provide', 'useClass', 'multi']);
    check(
      {provide: 'Bird', useFactory: getLang, multi: true},
      ['provide', 'useFactory', 'multi']);
  });

});
