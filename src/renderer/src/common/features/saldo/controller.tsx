import { useTranslation } from 'react-i18next'

import { LoadingOverlay } from '@/common/components'
import { Button } from '@/common/components/ui/button'

export interface SaldoCreateArgs {
  year: number
  month: number
  budjet_id?: number
  main_schet_id?: number
}
export interface SaldoControllerProps extends SaldoCreateArgs {
  isError?: boolean
  isCreating?: boolean
  onCreate?: (args: SaldoCreateArgs) => void
}
export const SaldoController = ({
  isError = false,
  isCreating,
  onCreate,
  year,
  month,
  budjet_id,
  main_schet_id
}: SaldoControllerProps) => {
  const { t } = useTranslation()

  const handleCreate = () => {
    onCreate?.({
      year,
      month,
      budjet_id,
      main_schet_id
    })
  }

  return (
    <>
      {isCreating ? <LoadingOverlay /> : null}
      <Button
        disabled={isCreating}
        isPending={isCreating}
        variant={isError ? 'destructive' : undefined}
        className="w-full"
        onClick={handleCreate}
      >
        {t('create_saldo')}
      </Button>
    </>
  )
}
