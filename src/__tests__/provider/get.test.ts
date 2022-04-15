import {describe, expect} from '@jest/globals';
import {L10nService} from '../abc/l10n.service';
import {Provider} from '../../provider';
import {User} from '../abc/user';

describe('Provider.get', () => {

  test('primitive can be result', () => {
    const provider = new Provider();
    provider.set({provide: L10nService, deps:['jp']});
    provider.set({provide: User, deps: [L10nService, 'John']});

    const user = provider.get<User>(User) as User;
    expect(user.l10nService).not.toBe(undefined);
    expect(user).toHaveProperty('lang', 'jp');
    expect(user).toHaveProperty('name', 'John');
  });

  test('', () => {

  });

  // test('', () => {
  //
  // });

});
