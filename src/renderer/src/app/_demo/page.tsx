import { PDFViewer } from '@react-pdf/renderer'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

import { Textarea } from '@/common/components/ui/textarea'

import { AktPriyomReport } from './akt-priyom/akt-priyom'

interface IMaterialAktPriyomStore {
  headerText: string
  setHeaderText: (headerText: string) => void
}

const useMaterialAktPriyomStore = create(
  persist<IMaterialAktPriyomStore>(
    (set) => ({
      headerText: '',
      setHeaderText: (headerText: string) => set({ headerText })
    }),
    {
      name: 'material_akt_priyom'
    }
  )
)

const DemoPage = () => {
  const { headerText, setHeaderText } = useMaterialAktPriyomStore()
  return (
    <div className="p-10 flex-1 flex flex-col gap-5 overflow-y-auto scrollbar">
      <div>
        <Textarea
          value={headerText}
          onChange={(e) => setHeaderText(e.target.value)}
        />
      </div>
      <PDFViewer className="h-full">
        <AktPriyomReport
          docNum="4F000"
          docDate="10-10-2024"
          dovernost="F012999"
          headerText={headerText}
          commissionBoss={[
            {
              fio: 'М.Мансуров',
              military_rank: 'майор'
            },
            {
              fio: 'А.Айдаров',
              military_rank: 'подполковник'
            }
          ]}
          commissionMembers={[
            {
              fio: 'М.Мансуров',
              military_rank: 'майор'
            },
            {
              fio: 'А.Айдаров',
              military_rank: 'подполковник'
            }
          ]}
          commissionSecretary={[
            {
              fio: 'М.Мансуров',
              military_rank: 'майор'
            },
            {
              fio: 'А.Айдаров',
              military_rank: 'подполковник'
            }
          ]}
          products={[
            {
              id: 3874,
              naimenovanie_tovarov_jur7_id: 1774418,
              kol: 1,
              sena: 11110,
              nds_foiz: 0,
              summa: 11110,
              debet_schet: '010',
              debet_sub_schet: '4352000',
              kredit_schet: '013',
              kredit_sub_schet: '4352000',
              data_pereotsenka: '2024-12-01',
              eski_iznos_summa: 0,
              iznos: true,
              iznos_start: '2024-12-01',
              name: 'test2',
              inventar_num: '3213213',
              serial_num: '12321',
              edin: 'rn',
              group_number: '1'
            }
          ]}
        />
      </PDFViewer>
    </div>
  )
}

export default DemoPage
