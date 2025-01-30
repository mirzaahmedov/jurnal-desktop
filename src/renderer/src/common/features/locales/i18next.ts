import i18next from 'i18next'
import httpBackend from 'i18next-http-backend'
import { initReactI18next } from 'react-i18next'

export const initLocales = () => {
  return i18next
    .use(httpBackend)
    .use(initReactI18next)
    .init({
      lng: 'uz',
      fallbackLng: 'uz',

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
