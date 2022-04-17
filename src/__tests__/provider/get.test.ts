import {describe, expect} from '@jest/globals';
import 'reflect-metadata';
import {L10nService} from '../abc/l10n.service';
import {Duck, Turkey} from '../abc/bird'
import {Provider} from '../../provider';
import {getLang} from '../abc/getLang'
import {User} from '../abc/user';

//region Support

const provider = Provider.of([
  {provide: User, deps: [L10nService, 'Naruto']},
  {provide: L10nService, deps: ['ja']},
  {provide: 'lang-factory', useFactory: getLang, deps: [User]},
  {provide: Turkey, useClass: Turkey},
  {provide: Duck, useValue: new Duck()},
  {provide: 'Birds', useClass: Duck, multi: true},
  {provide: 'Birds', useClass: Turkey, multi: true},
  {provide: 'Birds', useValue: 'Eagle', multi: true},
]);

//endregion Support

describe('Provider.get', () => {

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

  test(`multi 'Bird'`, () => {
    provider.getAll('Birds');
    const birds = provider.getAll('Birds') as Array<any>;
    const duck = birds[0] as Duck;
    const turkey = birds[1] as Turkey
    expect(birds.length).toBe(3);
    expect(duck instanceof Duck).toBe(true);
    expect(turkey instanceof Turkey).toBe(true);
    expect(birds[2]).toBe('Eagle');

    provider.getOnlyOne<Duck>(Duck);
    const duck2 = provider.getOnlyOne<Duck>(Duck);
    expect(duck2 instanceof Duck).toBe(true);
    expect(duck !== duck2).toBe(true);
  });

});
