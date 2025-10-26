import { defineConfig } from 'vite'

export default defineConfig({
  base: '/',
  build: {
    rollupOptions: {
      input: {
        main: 'index.html',
        privacy: 'privacy.html',
        terms: 'terms.html',
        'privacy-ja': 'privacy-ja.html',
        'privacy-zh': 'privacy-zh.html',
        'privacy-yue': 'privacy-yue.html',
        'privacy-es': 'privacy-es.html',
        'privacy-th': 'privacy-th.html',
        'privacy-ko': 'privacy-ko.html',
        'privacy-pt': 'privacy-pt.html',
        'privacy-ru': 'privacy-ru.html',
        'privacy-ar': 'privacy-ar.html',
        'privacy-fa': 'privacy-fa.html',
        'privacy-vi': 'privacy-vi.html',
        'privacy-hi-ur': 'privacy-hi-ur.html',
        'privacy-tr': 'privacy-tr.html',
        'privacy-id': 'privacy-id.html',
        'terms-ja': 'terms-ja.html',
        'terms-zh': 'terms-zh.html',
        'terms-yue': 'terms-yue.html',
        'terms-es': 'terms-es.html',
        'terms-th': 'terms-th.html',
        'terms-ko': 'terms-ko.html',
        'terms-pt': 'terms-pt.html',
        'terms-ru': 'terms-ru.html',
        'terms-ar': 'terms-ar.html',
        'terms-fa': 'terms-fa.html',
        'terms-vi': 'terms-vi.html',
        'terms-hi-ur': 'terms-hi-ur.html',
        'terms-tr': 'terms-tr.html',
        'terms-id': 'terms-id.html',
      }
    }
  }
})
