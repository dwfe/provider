import {describe, expect} from '@jest/globals';
import {arraysEqualStrictCheck} from '../../util';
import {L10nService} from '../abc/l10n.service';
import {Entry} from '../../registry';
import {Duck} from '../abc/bird';
import {User} from '../abc/user';

//region Support

export function checkCloned(orig: Entry, cloned: Entry) {
  expect(orig === cloned).toBe(false);
  expect(orig.equals(cloned)).toBe(true);
  if (orig.deps) {
    expect(orig.deps === cloned.deps).toBe(false);
    expect(arraysEqualStrictCheck(orig.deps, cloned.deps)).toBe(true);
  }
}

//endregion Support

describe('Entry.clone', () => {

  test('check', () => {
    const entry2 = new Entry({provide: Duck});
    checkCloned(entry2, entry2.clone());

    const entry3 = new Entry({provide: Duck, deps: []});
    checkCloned(entry3, entry3.clone());

    const entry = new Entry({provide: Duck, deps: [User, L10nService]});
    checkCloned(entry, entry.clone());
  });

});
