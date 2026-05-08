function setupFaqAccordion() {
  document.querySelectorAll('.faq-item').forEach((item) => {
    const question = item.querySelector('.faq-question');

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
        window.gtag('event', 'app_store_click', {
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
