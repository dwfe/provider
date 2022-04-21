import {describe} from '@jest/globals'
import 'reflect-metadata';
import {Provider} from '../../provider'
import {Throw} from '../util'
import {Duck, Turkey} from '../abc/bird';
import {injectable} from '../../decorator';

describe('Provider.get', () => {

  test('get. incorrect provide', () => {
    const provider = Provider.of([
      {provide: 'Birds', useValue: 'Duck', multi: true},
      {provide: 'Birds', useValue: 'Turkey', multi: true},
      {provide: 'Birds', useValue: 'Eagle', multi: true},
    ]);
    Throw(() => provider.get('Birds'), 'The value is not the only one. Instead, use "getAll" method');
  });


  test('getAll. unregistered provide [primitive type]', () => {
    Throw(() => Provider.of([]).getAll('Hello'), 'Unregistered "provide" [primitive type]');
  });


  test('getAll. unregistered provide [non-primitive type]', () => {
    class Hello {
    }

    Throw(() => Provider.of([]).getAll(Hello), 'Unregistered "provide" [non-primitive type]');
  });


  test('getAll. unregistered provide [dep]', () => {
    class World {

    }

    @injectable()
    class Hello {
      constructor(public world: World) {
      }
    }

    Throw(() => Provider.of([]).getAll(Hello), 'Unregistered "provide" [dep]');
  });

});
