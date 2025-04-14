import { useEffect } from 'react'

import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle
} from '@/common/components/ui/alert-dialog'
import { SaldoNamespace, useSaldoController } from '@/common/features/saldo'
import { useToggle } from '@/common/hooks'

export const MainbookSaldoUpdateManager = () => {
  const dialogToggle = useToggle()

  const { queuedMonths } = useSaldoController({
    ns: SaldoNamespace.MAINBOOK
  })

  useEffect(() => {
    if (queuedMonths.length) {
      dialogToggle.open()
    }
  }, [queuedMonths])

  return (
    <AlertDialog
      open={dialogToggle.isOpen}
      onOpenChange={dialogToggle.setOpen}
    >
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Locked</AlertDialogTitle>
        </AlertDialogHeader>
        <div></div>
      </AlertDialogContent>
    </AlertDialog>
  )
}
