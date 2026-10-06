import {
  getSearchableBodyElements
} from './article-search-dom';

describe('getSearchableBodyElements', () => {
  it(
    'esclude dalla ricerca il contenuto dei CodePen',
    () => {
      const root =
        document.createElement('div');

      root.innerHTML = `
        <p>Testo prima del CodePen</p>

        <div class="codepen-demo">
          <pre data-lang="html">
            &lt;button&gt;Demo CodePen&lt;/button&gt;
          </pre>

          <pre data-lang="css">
            .button { display: flex; }
          </pre>

          <pre data-lang="js">
            console.log('CodePen');
          </pre>
        </div>

        <pre>
          Snippet statico ricercabile
        </pre>

        <p>Testo dopo il CodePen</p>
      `;

      const elements =
        getSearchableBodyElements(root);

      expect(
        elements.map(
          (element) =>
            element.textContent?.trim()
        )
      ).toEqual([
        'Testo prima del CodePen',
        'Snippet statico ricercabile',
        'Testo dopo il CodePen'
      ]);
    }
  );
});
