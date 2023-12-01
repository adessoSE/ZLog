import { buildQueryForMarkedRows } from './buildQueryForMarkedRows';

describe('buildQueryForMarkedRows()', () => {
  it('returns correct string for multiple marked rows', () => {
    const input = {
      abc: true,
      def: true,
      xyz: false,
    };
    const actual = buildQueryForMarkedRows(input);
    const expected = 'fq=id:abc OR id:def';

    expect(actual).toBe(expected);
  });
});
