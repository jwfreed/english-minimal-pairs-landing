import './style.css'
import { translations, getCurrentLanguage, setLanguage, applyTranslations } from './i18n.js'

// ===========================
// Initialize Language on Page Load
// ===========================
document.addEventListener('DOMContentLoaded', () => {
  const currentLang = getCurrentLanguage();
  applyTranslations(currentLang);
  
  console.log('Minimal Pairs Trainer - Landing Page Loaded');
  console.log(`Current language: ${currentLang}`);
  console.log('Built with mobile-first design and conversion optimization');
  
  // Set initial state
  if (pairExample) {
    pairExample.classList.add('hidden');
  }
  
  // Add loading animation complete
  document.body.style.opacity = '0';
  setTimeout(() => {
    document.body.style.transition = 'opacity 0.3s ease';
    document.body.style.opacity = '1';
  }, 100);
});

// ===========================
// Language Switcher
// ===========================
const languageButton = document.getElementById('language-selector');
const languageDropdown = document.getElementById('language-dropdown');

languageButton?.addEventListener('click', () => {
  languageDropdown?.classList.toggle('show');
});

// Close dropdown when clicking outside
document.addEventListener('click', (e) => {
  if (!e.target.closest('.language-switcher')) {
    languageDropdown?.classList.remove('show');
  }
});

// Handle language selection
document.querySelectorAll('.lang-option').forEach(option => {
  option.addEventListener('click', (e) => {
    const lang = e.currentTarget.dataset.lang;
    setLanguage(lang);
    languageDropdown?.classList.remove('show');
    
    // Reload minimal pairs example if visible
    const selectedLanguage = document.getElementById('native-language').value;
    if (selectedLanguage && minimalPairs[selectedLanguage]) {
      updateMinimalPairsExample(selectedLanguage);
    }
  });
});

// ===========================
// Language-Specific Minimal Pairs
// ===========================
const minimalPairs = {
  japanese: {
    words: ['right', 'light'],
    challenge: '/r/ vs /l/ sounds'
  },
  mandarin: {
    words: ['thin', 'sin'],
    challenge: '/θ/ vs /s/ sounds'
  },
  thai: {
    words: ['thin', 'tin'],
    challenge: '/θ/ vs /t/ sounds'
  },
  spanish: {
    words: ['ship', 'sheep'],
    challenge: '/ɪ/ vs /iː/ sounds'
  },
  korean: {
    words: ['light', 'right'],
    challenge: '/l/ vs /r/ sounds'
  },
  arabic: {
    words: ['park', 'bark'],
    challenge: '/p/ vs /b/ sounds'
  },
  vietnamese: {
    words: ['sheep', 'ship'],
    challenge: 'vowel length distinction'
  },
  other: {
    words: ['pen', 'pan'],
    challenge: 'vowel sounds'
  }
};

// ===========================
// Language Selector Interaction (Native Language Picker)
// ===========================
const nativeLanguageDropdown = document.getElementById('native-language');
const pairExample = document.getElementById('pair-example');
const word1El = document.getElementById('word1');
const word2El = document.getElementById('word2');
const pairIntro = document.querySelector('.pair-intro');

nativeLanguageDropdown?.addEventListener('change', (e) => {
  const selectedLanguage = e.target.value;
  
  if (selectedLanguage && minimalPairs[selectedLanguage]) {
    const pair = minimalPairs[selectedLanguage];
    
    // Update the words
    word1El.textContent = pair.words[0];
    word2El.textContent = pair.words[1];
    
    // Update the intro text
    pairIntro.textContent = `Common challenge for you: ${pair.challenge}`;
    
    // Show the example with animation
    pairExample.classList.remove('hidden');
    
    // Smooth scroll to the example
    setTimeout(() => {
      pairExample.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }, 100);
  } else {
    pairExample.classList.add('hidden');
  }
});

// ===========================
// Sound Button Interactions with TTS
// ===========================
const soundButtons = document.querySelectorAll('.sound-button');

// Function to speak text using Web Speech API
function speakWord(text) {
  // Cancel any ongoing speech
  window.speechSynthesis.cancel();
  
  const utterance = new SpeechSynthesisUtterance(text);
  
  // Configure speech settings
  utterance.lang = 'en-US'; // American English
  utterance.rate = 0.8; // Slightly slower for clarity
  utterance.pitch = 1.0;
  utterance.volume = 1.0;
  
  // Try to use a high-quality voice if available
  const voices = window.speechSynthesis.getVoices();
  const preferredVoice = voices.find(voice => 
    voice.lang.startsWith('en-US') && 
    (voice.name.includes('Google') || voice.name.includes('Microsoft') || voice.name.includes('Samantha'))
  );
  
  if (preferredVoice) {
    utterance.voice = preferredVoice;
  }
  
  window.speechSynthesis.speak(utterance);
  return utterance;
}

// Load voices (needed for some browsers)
if (window.speechSynthesis) {
  window.speechSynthesis.getVoices();
  window.speechSynthesis.addEventListener('voiceschanged', () => {
    window.speechSynthesis.getVoices();
  });
}

soundButtons.forEach(button => {
  button.addEventListener('click', (e) => {
    e.preventDefault();
    
    // Add click animation
    button.style.transform = 'scale(0.95)';
    setTimeout(() => {
      button.style.transform = '';
    }, 150);
    
    // Get the word to speak
    const word = button.querySelector('.sound-word').textContent;
    console.log(`Playing audio for: ${word}`);
    
    // Speak the word using TTS
    speakWord(word);
    
    // Visual feedback
    const icon = button.querySelector('.sound-icon');
    const originalIcon = icon.textContent;
    icon.textContent = '🔊';
    setTimeout(() => {
      icon.textContent = originalIcon;
    }, 1000);
  });
});

// ===========================
// FAQ Accordion
// ===========================
const faqItems = document.querySelectorAll('.faq-item');

faqItems.forEach(item => {
  const question = item.querySelector('.faq-question');
  
  question?.addEventListener('click', () => {
    // Close other items
    faqItems.forEach(otherItem => {
      if (otherItem !== item && otherItem.classList.contains('active')) {
        otherItem.classList.remove('active');
      }
    });
    
    // Toggle current item
    item.classList.toggle('active');
  });
});

// ===========================
// Smooth Scroll for Anchor Links
// ===========================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const href = this.getAttribute('href');
    
    // Don't prevent default for hash-only links (like "#")
    if (href === '#') return;
    
    e.preventDefault();
    
    const target = document.querySelector(href);
    if (target) {
      const navHeight = document.querySelector('.nav')?.offsetHeight || 70;
      const targetPosition = target.offsetTop - navHeight - 20;
      
      window.scrollTo({
        top: targetPosition,
        behavior: 'smooth'
      });
    }
  });
});

// ===========================
// Navbar Scroll Effect
// ===========================
let lastScroll = 0;
const nav = document.querySelector('.nav');

window.addEventListener('scroll', () => {
  const currentScroll = window.pageYOffset;
  
  // Add shadow on scroll
  if (currentScroll > 50) {
    nav?.classList.add('scrolled');
    if (nav) {
      nav.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)';
    }
  } else {
    nav?.classList.remove('scrolled');
    if (nav) {
      nav.style.boxShadow = 'none';
    }
  }
  
  lastScroll = currentScroll;
});

// ===========================
// Demo Phone Mockup Interaction
// ===========================
const demoPlayButton = document.querySelector('.demo-play');
const optionButtons = document.querySelectorAll('.option-btn');
const demoFeedback = document.querySelector('.demo-feedback');

demoPlayButton?.addEventListener('click', () => {
  // Animate play button
  demoPlayButton.style.transform = 'scale(0.95)';
  setTimeout(() => {
    demoPlayButton.style.transform = '';
  }, 150);
  
  console.log('Playing demo audio');
});

optionButtons.forEach((button, index) => {
  button.addEventListener('click', () => {
    // Remove selection from all buttons
    optionButtons.forEach(btn => btn.classList.remove('option-selected'));
    
    // Add selection to clicked button
    button.classList.add('option-selected');
    
    // Show feedback (for demo purposes, always show correct)
    if (demoFeedback) {
      demoFeedback.style.display = 'flex';
    }
  });
});

// ===========================
// Intersection Observer for Animations
// ===========================
const observerOptions = {
  threshold: 0.1,
  rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
    }
  });
}, observerOptions);

// Observe elements for scroll animations
const animateOnScroll = document.querySelectorAll(
  '.problem-card, .step, .science-card, .testimonial-card, .feature-card'
);

animateOnScroll.forEach(el => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(30px)';
  el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
  observer.observe(el);
});

// ===========================
// CTA Button Tracking (Console Demo)
// ===========================
const ctaButtons = document.querySelectorAll('.btn-primary');

ctaButtons.forEach(button => {
  button.addEventListener('click', (e) => {
    const buttonText = button.textContent.trim();
    console.log(`CTA clicked: ${buttonText}`);
    
    // In production, this would track conversion events
    // Example: analytics.track('CTA_Click', { button: buttonText });
  });
});

// ===========================
// Initialize Demo State
// ===========================
document.addEventListener('DOMContentLoaded', () => {
  console.log('Minimal Pairs Trainer - Landing Page Loaded');
  console.log('Built with mobile-first design and conversion optimization');
  
  // Set initial state
  if (pairExample) {
    pairExample.classList.add('hidden');
  }
  
  // Add loading animation complete
  document.body.style.opacity = '0';
  setTimeout(() => {
    document.body.style.transition = 'opacity 0.3s ease';
    document.body.style.opacity = '1';
  }, 100);
});

// ===========================
// Performance Monitoring
// ===========================
if ('PerformanceObserver' in window) {
  // Monitor largest contentful paint
  const observer = new PerformanceObserver((list) => {
    const entries = list.getEntries();
    const lastEntry = entries[entries.length - 1];
    console.log('LCP:', lastEntry.renderTime || lastEntry.loadTime);
  });
  
  observer.observe({ entryTypes: ['largest-contentful-paint'] });
}

// ===========================
// Mobile Menu (if needed in future)
// ===========================
// Placeholder for mobile hamburger menu functionality
// Can be expanded if navigation grows

console.log('🎧 Minimal Pairs Trainer ready!');
