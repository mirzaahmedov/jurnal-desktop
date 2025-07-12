import type { ReportItem } from "./types"

export const getMockingReports = (): ReportItem[] => {
    return [
        {
            id: 1,
            year: 2023,
            month: 1,
            name: 'January Report',
            type: 'Monthly',
            budjet: '10000',
            kol: 5,
            enabled: true,
            children: [
                {
                    id: 11,
                    year: 2023,
                    month: 1,
                    name: 'January Subreport',
                    type: 'Monthly',
                    budjet: '5000',
                    kol: 2,
                    enabled: true,
                    children: []
                },
                {
                    id: 12,
                    year: 2023,
                    month: 1,
                    name: 'Another January Subreport',
                    type: 'Monthly',
                    budjet: '5000',
                    kol: 3,
                    enabled: false,
                    children: []
                }
            ]
        },
        {
            id: 2,
            year: 2023,
            month: 2,
            name: 'February Report',
            type: 'Monthly',
            budjet: '12000',
            kol: 6,
            enabled: false,
            children: []
        }
    ] satisfies ReportItem[]
}