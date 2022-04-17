import {describe, expect} from '@jest/globals'
import {User} from '../abc/user'
import {Provider} from '../../provider'
import {L10nService} from '../abc/l10n.service'
import {getLang} from '../abc/getLang'
import {Duck, Turkey} from '../abc/bird'

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

describe('Some special cases', () => {

  test('primitive can be result', () => {
    const value = provider.getOnlyOne<User>(User);
    expect(value).toBeTruthy();
    expect(value instanceof User).toBe(true);
    expect(value.l10nService).not.toBe(undefined);
    expect(value).toHaveProperty('lang', 'ja');
    expect(value).toHaveProperty('name', 'Naruto');
  });

  test('single can be manual replaced', () => {
    class Some {
    }

    provider.register({provide: Some, useValue: new Some()});

    const obj = provider.getOnlyOne<Some>(Some);
    expect(obj instanceof Some).toBe(true);
    provider.register({provide: Some, useValue: new Some()});
    const obj2 = provider.getOnlyOne<Some>(Some);
    expect(obj !== obj2).toBe(true);
  });

});
