import {describe} from '@jest/globals'
import 'reflect-metadata';
import {Provider} from '../../provider'
import {toThrow} from '../util'
import {Duck, Turkey} from '../abc/bird';
import {injectable} from '../../decorator';

describe('Provider.get', () => {

  test('getOnlyOne. incorrect provide', () => {
    const provider = Provider.of([
      {provide: 'Birds', useValue: 'Duck', multi: true},
      {provide: 'Birds', useValue: 'Turkey', multi: true},
      {provide: 'Birds', useValue: 'Eagle', multi: true},
    ]);
    toThrow(() => provider.getOnlyOne('Birds'), 'The value is not the only one');
  });


  test('getAll. unregistered provide [primitive type]', () => {
    toThrow(() => Provider.of([]).getAll('Hello'), 'Unregistered "provide" [primitive type]');
  });


  test('getAll. unregistered provide [non-primitive type]', () => {
    class Hello {
    }

    toThrow(() => Provider.of([]).getAll(Hello), 'Unregistered "provide" [non-primitive type]');
  });


  test('getAll. unregistered provide [dep]', () => {
    class World {

    }

    @injectable()
    class Hello {
      constructor(public world: World) {
      }
    }

    toThrow(() => Provider.of([]).getAll(Hello), 'Unregistered "provide" [dep]');
  });

});
