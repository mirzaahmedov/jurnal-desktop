import i18next from 'i18next'
import httpBackend from 'i18next-http-backend'
import { initReactI18next } from 'react-i18next'
import { z } from 'zod'

const localeSchema = z.enum(['uz', 'ru']).catch('ru')

i18next.on('languageChanged', (lang) => {
  localStorage.setItem('app-lang', lang)
})

export const initLocales = () => {
  const lang = localeSchema.safeParse(localStorage.getItem('app-lang'))
  return i18next
    .use(httpBackend)
    .use(initReactI18next)
    .init({
      lng: lang.data,
      fallbackLng: 'ru',

      defaultNS: 'common',
      fallbackNS: ['common'],

      backend: {
        loadPath: './locales/{{lng}}/{{ns}}.json'
      },

      interpolation: {
        escapeValue: false
      }
    })
}
