import {describe, expect} from '@jest/globals'
import 'reflect-metadata';
import {L10nService} from '../abc/l10n.service'
import {Duck, Turkey} from '../abc/bird'
import {Provider} from '../../provider'
import {A, B, C, D} from '../abc/abcd'
import {getLang} from '../abc/getLang'
import {Entry} from '../../registry'
import {User} from '../abc/user'

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

describe('Decorators: @injectable, @single', () => {

  test('@injectable + @single', () => {
    let d = provider.getOnlyOne<D>(D);
    expect(d).toBeTruthy();
    expect(d.c instanceof C).toBe(true);
    expect(d.b instanceof B).toBe(true);
    expect(d.b.a instanceof A).toBe(true);
    expect(d.b.a.name).toBe(undefined);

    // еще раз запросить синглтон и проверить одиночность
    d = provider.getAll<any>(D);
    let b = provider.getOnlyOne<B>(B);
    expect(b instanceof B).toBe(true);
    b = provider.getAll<B>(B) as B;
    expect(b instanceof B).toBe(true);
    const bEntry = provider['registry'].get(B) as Entry[];
    expect(Array.isArray(bEntry)).toBe(true);
    expect(bEntry.length).toBe(1);
    expect(bEntry[0].useValue instanceof B).toBe(true);
  });

  test('@injectable isOnlyOne', () => {

  });

  test('@single really the only one', () => {

  });

  test('inject prop', () => {

  });

});
