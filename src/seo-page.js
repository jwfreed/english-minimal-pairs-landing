function setupFaqAccordion() {
  document.querySelectorAll('.faq-item').forEach((item) => {
    const question = item.querySelector('.faq-question');
    const answer = item.querySelector('.faq-answer');

    if (question && answer) {
      question.setAttribute('aria-expanded', String(item.classList.contains('active')));
    }

    question?.addEventListener('click', () => {
      const isExpanded = item.classList.toggle('active');
      question.setAttribute('aria-expanded', String(isExpanded));
    });
  });
}

function setupSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', function handleAnchorClick(event) {
      const href = this.getAttribute('href');

      if (href === '#') {
        return;
      }

      const target = document.querySelector(href);
      if (!target) {
        return;
      }

      event.preventDefault();
      const navHeight = document.querySelector('.nav')?.offsetHeight || 70;

      window.scrollTo({
        top: target.offsetTop - navHeight - 20,
        behavior: 'smooth',
      });
    });
  });
}

function setupCtaTracking() {
  document.querySelectorAll('a[href*="apps.apple.com"]').forEach((link) => {
    link.addEventListener('click', () => {
      if (typeof window.gtag === 'function') {
        const buttonText = link.textContent.trim().replace(/\s+/g, ' ');

        window.gtag('event', 'app_store_click', {
          button_text: buttonText || link.getAttribute('aria-label') || undefined,
          page_path: window.location.pathname,
          link_url: link.href,
          link_id: link.id || undefined,
          transport_type: 'beacon',
        });
      }
    });
  });
}

document.addEventListener('DOMContentLoaded', () => {
  setupFaqAccordion();
  setupSmoothScroll();
  setupCtaTracking();
});
