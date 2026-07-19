export const SEO_EXERCISE_SUMMARY_CTA_POSITION = 'exercise-summary';

export function createSeoExerciseSummaryCta({
  document,
  container,
  uiCopy,
  appStoreHref,
}) {
  let element = null;

  const remove = () => {
    element?.remove();
    element = null;
  };

  return {
    getElement() {
      return element;
    },

    sync(snapshot) {
      if (snapshot?.stage !== 'summary') {
        remove();
      }
    },

    show(snapshot) {
      if (snapshot?.stage !== 'summary' || !appStoreHref) {
        return null;
      }

      const copy = uiCopy.summaryCta(snapshot);

      if (!element) {
        element = document.createElement('div');
        element.className = 'seo-exercise-summary-cta';

        const headline = document.createElement('h3');
        headline.className = 'seo-exercise-summary-cta-headline';

        const body = document.createElement('p');
        body.className = 'seo-exercise-summary-cta-body';

        const link = document.createElement('a');
        link.className = 'seo-exercise-summary-cta-link';
        link.href = appStoreHref;
        link.dataset.ctaPosition = SEO_EXERCISE_SUMMARY_CTA_POSITION;

        element.append(headline, body, link);
        container.append(element);
      }

      element.querySelector('.seo-exercise-summary-cta-headline').textContent = copy.headline;
      element.querySelector('.seo-exercise-summary-cta-body').textContent = copy.body;
      element.querySelector('.seo-exercise-summary-cta-link').textContent = copy.label;

      return element;
    },
  };
}
