import {describe, expect} from '@jest/globals';
import {Entry, IEntry} from '../../registry'
import {Duck, Turkey} from '../abc/bird'
import {User} from '../abc/user';

function okEquality(entry: IEntry) {
  expect(new Entry(entry).equals(new Entry(entry))).toBe(true)
}

describe(`equals`, () => {

  test(`class instance provided`, () => {
    okEquality({provide: Duck});
    okEquality({provide: Duck, useClass: Duck});
    okEquality({provide: Duck, useClass: Duck, deps: ['quack!']});
    okEquality({provide: Duck, useClass: Duck, deps: []});
    okEquality({provide: Duck, useClass: Duck, deps: [null, User]});
    okEquality({provide: Turkey, useClass: Duck, deps: ['ololo!']});
  });

  test(`factory result provided`, () => {
    okEquality({provide: "lang", useFactory: (user: User) => user?.lang || 'en', deps: [User]});
  });

  test(`value provided`, () => {
    okEquality({provide: Duck, useValue: 123});
    okEquality({provide: Turkey, useClass: Turkey, deps: ['ololo!'], useValue: 123});
  });

  test(`multiple provided`, () => {
    okEquality({provide: "Bird", useClass: Duck, multi: true});
    okEquality({provide: "Bird", useValue: 'Eagle', multi: true});
  });

});
