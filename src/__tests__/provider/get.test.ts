import {describe, expect} from '@jest/globals';
import 'reflect-metadata';
import {L10nService} from '../abc/l10n.service';
import {Duck, Turkey} from '../abc/bird'
import {Provider} from '../../provider';
import {A, B, C, D} from '../abc/abcd'
import {getLang} from '../abc/getLang'
import {User} from '../abc/user';

//region Support

const provider = Provider.of([
  {provide: User, deps: [L10nService, 'Naruto']},
  {provide: L10nService, deps: ['ja']},
  {provide: 'lang-factory', useFactory: getLang, deps: [User]},
  {provide: Turkey, useClass: Turkey},
  {provide: Duck, useValue: new Duck()},
  {provide: 'Birds', useClass: Turkey, multi: true},
  {provide: 'Birds', useClass: Duck, multi: true},
  {provide: 'Birds', useValue: 'Eagle', multi: true},
]);

//endregion Support

describe('Provider.getAll', () => {

  test('primitive can be result', () => {
    const value = provider.getOnlyOne<User>(User);
    expect(value).toBeTruthy();
    expect(value instanceof User).toBe(true);
    expect(value.l10nService).not.toBe(undefined);
    expect(value).toHaveProperty('lang', 'ja');
    expect(value).toHaveProperty('name', 'Naruto');
  });

  test('useClass', () => {
    const value = provider.getOnlyOne<Turkey>(Turkey);
    expect(value).toBeTruthy();
    expect(value instanceof Turkey).toBe(true);
    expect(value.sound()).toBe('ololo!');
  });

  test('useFactory', () => {
    const factoryResult = provider.getOnlyOne<string>('lang-factory');
    expect(factoryResult).toBe('ja');
  });

  test('useValue', () => {
    const value = provider.getOnlyOne<Duck>(Duck);
    expect(value).toBeTruthy();
    expect(value instanceof Duck).toBe(true);
    expect(value.sound()).toBe('quack!');
  });

  test('@injectable + @single', () => {
    const d = provider.getOnlyOne<D>(D);
    expect(d).toBeTruthy();
    expect(d.c instanceof C).toBe(true);
    expect(d.b instanceof B).toBe(true);
    expect(d.b.a instanceof A).toBe(true);
    expect(d.b.a.name).toBe(undefined);

    // TODO еще раз запросить синглтон и проверить одиночность
    //      проверить еще неодиночные инстансы

  });

  test('@injectable isOnlyOne', () => {

  });

  test('@single really the only one', () => {

  });

  test(`multi 'Bird'`, () => {
    const birds = provider.getAll('Birds') as Array<any>;
    expect(birds.length).toBe(3);
    expect(birds[0] instanceof Turkey).toBe(true);
    expect(birds[1] instanceof Duck).toBe(true);
    expect(birds[2]).toBe('Eagle');

  });

});
