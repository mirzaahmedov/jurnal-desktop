import logo from '@resources/logo.svg'
import { useQuery } from '@tanstack/react-query'

import { mainSchetQueryKeys, mainSchetService } from '@/app/region-spravochnik/main-schet'
import { useRequisitesStore } from '@/common/features/requisites'
import { useLayout } from '@/common/layout/store'

const HomePage = () => {
  const main_schet_id = useRequisitesStore((store) => store.main_schet_id)

  const { data: main_schet, isFetching } = useQuery({
    queryKey: [mainSchetQueryKeys.getById, main_schet_id],
    queryFn: mainSchetService.getById,
    enabled: !!main_schet_id
  })

  useLayout({
    title: ''
  })

  const schet = main_schet?.data

  return (
    <div className="relative flex-1 flex flex-col items-center justify-center py-10 overflow-hidden bg-green-50">
      <img
        src={logo}
        alt="MCHS Logo"
        className="absolute top-0 left-0 bottom-0 right-0 w-full h-full opacity-20"
      />
      {isFetching ? (
        <div className="flex justify-center">
          <div className="text-lg text-gray-600">Загрузка...</div>
        </div>
      ) : (
        <div className="w-full max-w-2xl p-6">
          <h1>
            <span className="text-3xl font-bold">Реквизиты</span>
          </h1>
          <ul className="space-y-3">
            {[
              { label: 'Наименование', value: schet?.account_name },
              { label: 'Номер', value: schet?.account_number },
              { label: 'Названия организации', value: schet?.tashkilot_nomi },
              { label: 'Банк', value: schet?.tashkilot_bank },
              { label: 'ИНН', value: schet?.tashkilot_inn },
              { label: 'МФО', value: schet?.tashkilot_mfo }
            ].map(({ label, value }) => (
              <li
                key={label}
                className="flex pb-2 last:border-b-0 last:pb-0 text-2xl text-black"
              >
                <span className="font-bold min-w-96">{label}:</span>
                <span className="font-bold">{value}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

export default HomePage
