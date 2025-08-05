import i18next from 'i18next'
import { initReactI18next } from 'react-i18next'
import { z } from 'zod'

import { capitalize } from '@/common/lib/string'

import appCyrl from './translations/cyrl/app.json'
import commonCyrl from './translations/cyrl/common.json'
import dashboardCyrl from './translations/cyrl/dashboard.json'
import pdfReportsCyrl from './translations/cyrl/pdf-reports.json'
import podotchetCyrl from './translations/cyrl/podotchet.json'
import podpisCyrl from './translations/cyrl/podpis.json'
import porucheniyaCyrl from './translations/cyrl/porucheniya.json'
import reportCyrl from './translations/cyrl/report.json'
import signInCyrl from './translations/cyrl/sign-in.json'
import userCyrl from './translations/cyrl/user.json'
import appRU from './translations/ru/app.json'
import commonRU from './translations/ru/common.json'
import dashboardRU from './translations/ru/dashboard.json'
import pdfReportsRU from './translations/ru/pdf-reports.json'
import podotchetRU from './translations/ru/podotchet.json'
import podpisRU from './translations/ru/podpis.json'
import porucheniyaRU from './translations/ru/porucheniya.json'
import reportRU from './translations/ru/report.json'
import signInRU from './translations/ru/sign-in.json'
import userRU from './translations/ru/user.json'
import appUZ from './translations/uz/app.json'
import commonUZ from './translations/uz/common.json'
import dashboardUZ from './translations/uz/dashboard.json'
import pdfReportsUZ from './translations/uz/pdf-reports.json'
import podotchetUZ from './translations/uz/podotchet.json'
import podpisUZ from './translations/uz/podpis.json'
import porucheniyaUZ from './translations/uz/porucheniya.json'
import reportUZ from './translations/uz/report.json'
import signInUZ from './translations/uz/sign-in.json'
import userUZ from './translations/uz/user.json'

const localeSchema = z.enum(['uz', 'ru', 'cyrl']).catch('cyrl')

i18next.on('languageChanged', (lang) => {
  localStorage.setItem('app-lang', lang)
})

i18next.use({
  type: 'postProcessor',
  name: 'capitalize',
  process(value: string) {
    return capitalize(value)
  }
})

export const initLocales = () => {
  const lang = localeSchema.safeParse(localStorage.getItem('app-lang'))
  return i18next.use(initReactI18next).init({
    lng: lang.data,
    fallbackLng: 'cyrl',

    defaultNS: 'common',
    fallbackNS: ['common'],

    resources: {
      ru: {
        app: appRU,
        common: commonRU,
        dashboard: dashboardRU,
        podotchet: podotchetRU,
        podpis: podpisRU,
        porucheniya: porucheniyaRU,
        'sign-in': signInRU,
        'pdf-reports': pdfReportsRU,
        user: userRU,
        report: reportRU
      },
      uz: {
        app: appUZ,
        common: commonUZ,
        dashboard: dashboardUZ,
        podotchet: podotchetUZ,
        podpis: podpisUZ,
        porucheniya: porucheniyaUZ,
        'sign-in': signInUZ,
        'pdf-reports': pdfReportsUZ,
        user: userUZ,
        report: reportUZ
      },
      cyrl: {
        app: appCyrl,
        common: commonCyrl,
        dashboard: dashboardCyrl,
        podotchet: podotchetCyrl,
        podpis: podpisCyrl,
        porucheniya: porucheniyaCyrl,
        'sign-in': signInCyrl,
        'pdf-reports': pdfReportsCyrl,
        user: userCyrl,
        report: reportCyrl
      }
    },

    interpolation: {
      escapeValue: false
    }
  })
}
