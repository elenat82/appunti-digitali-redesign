import { normalizeSearchText } from './normalize-search-text';

describe('normalizeSearchText', () => {
  it('normalizza maiuscole e minuscole', () => {
    expect(normalizeSearchText('Drupal SERVICE')).toBe('drupal service');
  });

  it('mantiene i caratteri tecnici', () => {
    expect(
      normalizeSearchText('.INFO.YML @Input ::BEFORE =>')
    ).toBe('.info.yml @input ::before =>');
  });

  it('non modifica la spaziatura', () => {
    expect(
      normalizeSearchText('npm   install')
    ).toBe('npm   install');
  });
});
