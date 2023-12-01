import { buildQueryForFacetSelected } from './buildQueryForFacetSelected';

describe('buildQueryForFacetSelected()', () => {
  it('returns correct string for one type, one facet', () => {
    const input = { 'component:abc': true };
    const actual = buildQueryForFacetSelected(input);
    const expected = 'fq=component:abc';

    expect(actual).toBe(expected);
  });

  it('returns correct string for one type and multiple facets', () => {
    const input = { 'component:abc': true, 'component:123': true, 'component:xyz': false };
    const actual = buildQueryForFacetSelected(input);
    const expected = 'fq=component:abc OR component:123';

    expect(actual).toBe(expected);
  });
});
