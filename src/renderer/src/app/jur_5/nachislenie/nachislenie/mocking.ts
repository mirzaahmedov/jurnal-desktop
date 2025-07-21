import type { NachislenieSostav } from '@/common/models'

export const getMockingNachislenieSostav = (): NachislenieSostav[] => {
  return [
    {
      id: 1,
      mainZarplataId: 1,
      foiz: 100,
      summa: 50000,
      nachislenieName: 'Основная зарплата',
      nachislenieTypeCode: 1,
      spravochnikZarpaltaNachislenieId: 1
    },
    {
      id: 2,
      mainZarplataId: 1,
      foiz: 10,
      summa: 5000,
      nachislenieName: 'Доплата',
      nachislenieTypeCode: 2,
      spravochnikZarpaltaNachislenieId: 1
    }
  ]
}
