import { useTranslation } from 'react-i18next'

import { Details } from '@/common/components/details'
import { Checkbox } from '@/common/components/ui/checkbox'

export const Main = () => {
  const { t } = useTranslation(['app'])
  return (
    <div className="grid grid-cols-[repeat(2,minmax(500px,1fr))] gap-5 h-full">
      <div className="p-10 grid grid-cols-[repeat(2,minmax(200px,1fr))] gap-5">
        <Details.Item
          label={t('card_num')}
          value="10020"
        />
        <div className="flex items-center gap-2">
          <Details.Item
            label={t('military')}
            value={<Checkbox />}
          />
          <Details.Item
            label={t('raschet_stop')}
            value={<Checkbox />}
          />
        </div>
      </div>
      <div className="p-10">
        <div className="border w-[200px] h-[calc(200px/3*4)] bg-gray-100 rounded-lg">
          <img
            src="/images/profile_placeholder.png"
            alt="Profile placeholder"
            className="w-full h-full object-cover object-center"
          />
        </div>
      </div>
    </div>
  )
}
