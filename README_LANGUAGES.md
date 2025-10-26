# Soundwise - Landing Page

A conversion-optimized, mobile-first landing page for the Soundwise pronunciation perception app.

## Features

- **Multi-language support** - Currently supports English, Japanese (日本語), Chinese (中文), and Spanish (Español)
- **Mobile-first responsive design**
- **Interactive demos** - Language-specific minimal pairs examples
- **Progress tracking visualization**
- **Science-backed messaging**
- **Conversion-optimized structure**

## Language Support

The landing page supports all 14 languages from the main app:

1. ✅ English (`en`)
2. ✅ 日本語 (Japanese)
3. ✅ 中文 (Mandarin Chinese)
4. ✅ idioma español (Spanish)
5. ⚠️ ภาษาไทย (Thai) - *Needs complete translations*
6. ⚠️ 한국어 (Korean) - *Needs complete translations*
7. ⚠️ Português (Portuguese) - *Needs complete translations*
8. ⚠️ русский язык (Russian) - *Needs complete translations*
9. ⚠️ اللغة العربية (Arabic) - *Needs complete translations*
10. ⚠️ Tiếng Việt (Vietnamese) - *Needs complete translations*
11. ⚠️ हिंदी/اردو (Hindi/Urdu) - *Needs complete translations*
12. ⚠️ Türkçe (Turkish) - *Needs complete translations*
13. ⚠️ زبان فارسی (Persian/Farsi) - *Needs complete translations*
14. ⚠️ 廣東話 (Cantonese) - *Needs complete translations*
15. ⚠️ bahasa Indo (Indonesian) - *Needs complete translations*

### Adding New Language Translations

To add complete translations for remaining languages:

1. Open `src/i18n.js`
2. Find the language key from `alternateLanguages.ts` (e.g., `'ภาษาไทย'` for Thai)
3. Copy the English translation object structure
4. Translate all keys while preserving the structure
5. Add the new language object to the `translations` export

Example structure:
```javascript
'ภาษาไทย': {
  name: 'ภาษาไทย',
  flag: '🇹🇭',
  navCta: '[Translated text]',
  heroTitle: '[Translated text]',
  // ... all other keys
}
```

## Development

```bash
npm install
npm run dev
```

Visit `http://localhost:5173` to view the landing page.

## Building for Production

```bash
npm run build
```

## Color Scheme

The landing page uses the authentic app color palette:
- **Primary Orange**: `#E67E22`
- **Primary Dark**: `#D35400`
- **Success Green**: `#27AE60`

## Key Sections

1. **Hero** - Language selector with personalized minimal pairs
2. **Problem** - Validates learner challenges by L1
3. **Solution** - Phone mockup with IPA notation
4. **How It Works** - 3-step process
5. **Progress Tracking** - Chart visualization matching app
6. **Science** - Research-backed credibility
7. **Testimonials** - Global social proof
8. **Features** - Multi-language, native audio, progress tracking
9. **FAQ** - Address objections
10. **Final CTA** - App store badges

## Language Switching

The page automatically:
- Detects user's browser language on first visit
- Saves language preference to localStorage
- Allows manual language switching via dropdown in navigation
- Updates all text content without page reload

## Credits

Based on the Soundwise app by Jonathan Freed.
Translations aligned with `app/constants/alternateLanguages.ts` from the main app repository.
