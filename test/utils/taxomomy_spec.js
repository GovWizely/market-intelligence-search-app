import { expect } from 'chai';
import * as helper from '../test_helper';
import { country } from '../../src/js/utils/taxonomy';

describe('taxonomy', () => {
  const names = 'Zambia,Zimbabwe,United States,United Kingdom';

  describe('#country', () => {
    it('return abbreviations of countries', () => {
      expect(country(names)).to.eql('ZM,ZW,US,GB');
    });
  });
});
