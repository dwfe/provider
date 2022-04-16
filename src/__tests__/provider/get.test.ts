import {describe, expect} from '@jest/globals';
import {L10nService} from '../abc/l10n.service';
import {getLang} from '../abc/get-lang'
import {Provider} from '../../provider';
import {User} from '../abc/user';

const provider = Provider.of([
  {provide: User, deps: [L10nService, 'Naruto']},
  {provide: L10nService, deps: ['ja']},
  {provide: 'lang-factory', useFactory: getLang, deps: [User]},
]);

describe('Provider.get', () => {

  test('primitive can be result', () => {
    const user = provider.getOnlyOne<User>(User);
    expect(user).toBeTruthy();
    expect(user.l10nService).not.toBe(undefined);
    expect(user).toHaveProperty('lang', 'ja');
    expect(user).toHaveProperty('name', 'Naruto');
  });

  test('useClass', () => {

  });

  test('useFactory', () => {
    const factoryResult = provider.getOnlyOne<string>('lang-factory');
    expect(factoryResult).toBe('ja');
  });

  // test('', () => {
  //
  // });

});