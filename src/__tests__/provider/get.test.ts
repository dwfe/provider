import {describe, expect} from '@jest/globals';
import {L10nService} from '../abc/l10n.service';
import {Provider} from '../../provider';
import {User} from '../abc/user';

describe('Provider.get', () => {

  test('primitive can be result', () => {
    const provider = Provider.of([
      {provide: User, deps: [L10nService, 'Naruto']},
      {provide: L10nService, deps: ['ja']}
    ]);
    const user = provider.getOnlyOne<User>(User);
    expect(user).toBeTruthy();
    expect(user.l10nService).not.toBe(undefined);
    expect(user).toHaveProperty('lang', 'ja');
    expect(user).toHaveProperty('name', 'Naruto');
  });

  test('', () => {

  });

  // test('', () => {
  //
  // });

});
