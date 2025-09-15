import { PassportInfoViewDialog } from '@/app/jur_5/passport-info/components/passport-info-view-dialog'
import { PassportInfoTabs, useZarplataStore } from '@/common/features/zarplata/store'

export const PassportInfoProvider = () => {
  const { mainZarplataId, mainZarplataViewList, openMainZarplataView, setCurrentTab } =
    useZarplataStore()

  return (
    <PassportInfoViewDialog
      isOpen={Boolean(mainZarplataId)}
      onOpenChange={(open) => {
        if (!open) {
          openMainZarplataView?.(null)
          setCurrentTab(PassportInfoTabs.Main)
        }
      }}
      mainZarplataId={mainZarplataId}
      items={mainZarplataViewList ?? []}
      onNavigateItem={(index) => {
        const item = mainZarplataViewList?.[index]
        if (item) {
          openMainZarplataView?.(item.id, mainZarplataViewList ?? [])
        }
      }}
      vacant={null}
    />
  )
}
