import {describe} from '@jest/globals'
import {Provider} from '../../provider'
import {toThrow} from '../util'

//region Support

const provider = Provider.of([]);

//endregion Support

describe('Provider.get', () => {

  test('getOnlyOne. incorrect provide', () => {
    toThrow(() => provider.getOnlyOne(123), 'The value is not the only one');
  });

});
