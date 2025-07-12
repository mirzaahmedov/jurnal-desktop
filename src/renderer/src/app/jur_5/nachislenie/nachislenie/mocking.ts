import type { Nachislenie, NachislenieSostav } from "@/common/models"

export const getMockingNachislenie = (): Nachislenie[] => {
    return [
        {
            id: 1,
            mainZarplataId: 1,
            kartochka: '12345',
            fio: 'Иванов Иван Иванович',
            rayon: 'Центральный',
            vacantId: 1,
            doljnostName: 'Инженер',
            zvanieName: 'Старший',
            istochFinance: 'Бюджет',
            sostav: 'Основной',
            typeVedomost: 'Начисление',
            typeVedomostSpravochnikZarplataId: null,
            docNum: 1001,
            docDate: new Date('2023-01-01'),
            tabelDocNum: 2001,
            tabelDocDate: '2023-01-02',
            nachislenieYear: 2023,
            nachislenieMonth: 1,
            nachislenieText: 'Начисление за январь',
            uderjanieText: 'Удержание за январь',
            dopOplataText: 'Доплата за январь',
            nachislenieSum: 50000,
            dopOplataSum: 5000,
            uderjanieSum: 2000,
            naRuki: 53000,
            spravochnikBudjetName: 'Государственный бюджет',
            spravochnikBudjetNameId: 1,
            mainSchetId: 1,
            description: null
        }
    ]
}

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