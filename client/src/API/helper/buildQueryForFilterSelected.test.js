import { buildQueryForFilterSelected } from './buildQueryForFilterSelected';

describe('buildQueryForFilterSelected()', () => {
  it('returns correct string for multiple filters', () => {
    const input = {
      component: { negated: false, values: ['marco-bp-report'] },
      level: { negated: false, values: ['WARN', 'INFO'] },
    };
    const actual = buildQueryForFilterSelected(input);
    const expected = 'fq=component:marco-bp-report&fq=level:WARN OR level:INFO';

    expect(actual).toBe(expected);
  });

  it('returns correct string for multiple filters (with negated ones)', () => {
    const input = {
      component: { negated: false, values: ['marco-bp-report'] },
      level: { negated: true, values: ['WARN'] },
    };
    const actual = buildQueryForFilterSelected(input);
    const expected = 'fq=component:marco-bp-report&fq=-level:WARN';

    expect(actual).toBe(expected);
  });
});
