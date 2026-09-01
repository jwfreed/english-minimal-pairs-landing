import { getCapabilityCtaLabel } from './seo-capability-cta.js';

export const SEO_EXERCISE_SUMMARY_CTA_POSITION = 'exercise-summary';
export const SEO_EXERCISE_INTERACTION_CTA_POSITION = 'post-interaction';

export function createSeoExerciseSummaryCta({
  document,
  container,
  uiCopy,
  appStoreHref,
  capability,
  locale,
  interactionCta,
}) {
  let element = null;
  let interactionElement = null;

  const remove = () => {
    element?.remove();
    element = null;
  };

  const removeInteraction = () => {
    interactionElement?.remove();
    interactionElement = null;
  };

  return {
    getElement() {
      return element;
    },

    getInteractionElement() {
      return interactionElement;
    },

    sync(snapshot) {
      if (snapshot?.stage !== 'summary') {
        remove();
      }

      const shouldRemoveInteraction =
        (snapshot?.stage === 'preview' && snapshot?.round === 1)
        || (snapshot?.stage === 'summary' && capability?.recommendedCTA);

      if (shouldRemoveInteraction) {
        removeInteraction();
      }
    },

    showInteraction(snapshot) {
      if (
        snapshot?.stage !== 'feedback'
        || !interactionCta?.container
        || !appStoreHref
      ) {
        return null;
      }

      if (!interactionElement) {
        interactionElement = document.createElement('div');
        interactionElement.className =
          'seo-exercise-summary-cta seo-exercise-interaction-cta';

        const headline = document.createElement('h3');
        headline.className = 'seo-exercise-summary-cta-headline';
        headline.textContent = interactionCta.headline;

        const body = document.createElement('p');
        body.className = 'seo-exercise-summary-cta-body';
        body.textContent = interactionCta.body;

        const link = document.createElement('a');
        link.className = 'seo-exercise-summary-cta-link';
        link.href = appStoreHref;
        link.id = interactionCta.linkId;
        link.dataset.ctaPosition = SEO_EXERCISE_INTERACTION_CTA_POSITION;
        link.dataset.appCapabilityCta = 'true';
        link.dataset.appCapabilityStatus = capability?.status || 'UNRESOLVED';
        link.textContent = interactionCta.linkLabel;

        interactionElement.append(headline, body, link);
        interactionCta.container.append(interactionElement);
      }

      return interactionElement;
    },

    show(snapshot) {
      if (
        snapshot?.stage !== 'summary'
        || !appStoreHref
        || !capability?.recommendedCTA
      ) {
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
      element.querySelector('.seo-exercise-summary-cta-link').textContent =
        getCapabilityCtaLabel(capability, locale);

      return element;
    },
  };
}
