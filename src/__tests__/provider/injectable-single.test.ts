import {describe, expect} from '@jest/globals'
import 'reflect-metadata';
import {injectable, single} from '../../decorator'
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
    let d = provider.get<D>(D);
    expect(d).toBeTruthy();
    expect(d.c instanceof C).toBe(true);
    expect(d.b instanceof B).toBe(true);
    expect(d.b.a instanceof A).toBe(true);
    expect(d.b.a.name).toBe(undefined);

    // еще раз запросить синглтон и проверить одиночность
    d = provider.getAll<any>(D);
    let b = provider.get<B>(B);
    expect(b instanceof B).toBe(true);
    b = provider.getAll<B>(B) as B;
    expect(b instanceof B).toBe(true);
    const bEntry = provider['registry'].get(B) as Entry[];
    expect(Array.isArray(bEntry)).toBe(true);
    expect(bEntry.length).toBe(1);
    expect(bEntry[0].useValue instanceof B).toBe(true);
  });

  test('@injectable isOnlyOne', () => {
    @injectable({isOnlyOne: true})
    class InjectableSingle {
    }

    const obj = provider.get<InjectableSingle>(InjectableSingle);
    const obj2 = provider.get<InjectableSingle>(InjectableSingle);
    expect(obj instanceof InjectableSingle).toBe(true);
    expect(obj2 instanceof InjectableSingle).toBe(true);
    expect(obj === obj2).toBe(true);
  });

  test('@single really the only one', () => {
    @single
    class Single {
    }

    const obj = provider.get<Single>(Single);
    const obj2 = provider.get<Single>(Single);
    expect(obj instanceof Single).toBe(true);
    expect(obj2 instanceof Single).toBe(true);
    expect(obj === obj2).toBe(true);
  });

  test('inject prop', () => {

  });

});
