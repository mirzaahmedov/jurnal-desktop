import type { OrganSaldoMonthValue, OrganSaldoProvodka } from '@/common/models'
import type { ColDef } from 'ag-grid-community'
import type { CustomCellRendererProps } from 'ag-grid-react'
import type { DialogTriggerProps } from 'react-aria-components'
import type { UseFormReturn } from 'react-hook-form'

import { type FC, useMemo } from 'react'

import { DotLottieReact } from '@lottiefiles/dotlottie-react'
import { ArrowRight } from 'lucide-react'
import { useTranslation } from 'react-i18next'

import { LoadingOverlay } from '@/common/components'
import { EditorTable } from '@/common/components/editor-table/editor-table'
import { Button } from '@/common/components/jolly/button'
import {
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogTitle,
  DialogTrigger
} from '@/common/components/jolly/dialog'
import { MonthPicker } from '@/common/components/month-picker'
import { Badge } from '@/common/components/ui/badge'

export interface OrganSaldoUpdateManagerProps extends Omit<DialogTriggerProps, 'children'> {
  form: UseFormReturn<any>
  queuedMonths: OrganSaldoMonthValue[]
  isFetching?: boolean
  isPending?: boolean
  year?: number
  month?: number
  onSubmit?: () => void
  totalRow?: Pick<OrganSaldoProvodka, 'name' | 'prixod' | 'rasxod' | 'summa'>[]
}
export const OrganSaldoUpdateManager: FC<OrganSaldoUpdateManagerProps> = ({
  queuedMonths,
  isFetching,
  isPending,
  year,
  month,
  form,
  onSubmit,
  totalRow,
  ...props
}) => {
  const { t } = useTranslation()

  const columnDefs = useMemo<ColDef<OrganSaldoProvodka>[]>(
    () => [
      {
        field: 'organization_id',
        width: 100,
        pinned: 'left',
        headerName: t('id'),
        valueFormatter: (params) => (params.value ? `#${params.value}` : '')
      },
      {
        field: 'name',
        width: 300,
        pinned: 'left',
        headerName: t('name'),
        cellClassRules: {
          'font-bold': (params) => params.node.rowPinned === 'bottom'
        }
      },
      {
        field: 'inn',
        width: 160,
        headerName: t('inn')
      },
      {
        field: 'mfo',
        width: 100,
        headerName: t('mfo')
      },
      {
        field: 'bank_klient',
        width: 300,
        headerName: t('bank')
      },
      {
        field: 'prixod',
        flex: 1,
        minWidth: 160,
        headerName: t('prixod'),
        cellRendererParams: {
          readOnly: true
        },
        cellRendererSelector: (params) => {
          if (params.node.rowPinned === 'bottom') {
            return {
              component: 'numberCell'
            }
          }
          return {
            component: 'numberEditor'
          }
        },
        cellClassRules: {
          'font-bold': (params) => params.node.rowPinned === 'bottom'
        }
      },
      {
        field: 'rasxod',
        flex: 1,
        minWidth: 160,
        headerName: t('rasxod'),
        cellRendererParams: {
          readOnly: true
        },
        cellRendererSelector: (params) => {
          if (params.node.rowPinned === 'bottom') {
            return {
              component: 'numberCell'
            }
          }
          return {
            component: 'numberEditor'
          }
        },
        cellClassRules: {
          'font-bold': (params) => params.node.rowPinned === 'bottom'
        }
      },
      {
        field: 'summa',
        pinned: 'right',
        flex: 1,
        minWidth: 160,
        headerName: t('summa'),
        cellRendererParams: {
          readOnly: true,
          allowNegative: true
        },
        cellRendererSelector: (params) => {
          if (params.node.rowPinned === 'bottom') {
            return {
              component: 'numberCell'
            }
          }
          return {
            component: 'numberEditor'
          }
        },
        cellClassRules: {
          'font-bold': (params) => params.node.rowPinned === 'bottom'
        }
      },
      {
        field: 'sub_childs',
        width: 80,
        pinned: 'right',
        headerName: '',
        cellRenderer: (props: CustomCellRendererProps) => {
          const count = props.value?.length ?? 0
          return props.node.rowPinned === 'bottom' ? null : (
            <div className="text-center">
              <Badge
                className="mx-auto"
                variant={count > 0 ? 'default' : 'secondary'}
              >
                {count}
              </Badge>
            </div>
          )
        }
      }
    ],
    [t]
  )

  return (
    <DialogTrigger {...props}>
      <DialogOverlay isDismissable={false}>
        <DialogContent
          isDismissable={false}
          closeButton={false}
          className="w-full max-w-[1690px] h-full max-h-[900px] p-0 flex flex-col gap-0"
        >
          {({ close }) => (
            <div className="flex flex-col h-full">
              <DialogHeader className="p-5 flex flex-row items-start justify-between gap-10">
                <div>
                  <DialogTitle className="text-xl font-bold">
                    {queuedMonths.length === 0
                      ? t('action-successful')
                      : t('saldo_update_required')}
                  </DialogTitle>
                  <DialogDescription className="mt-2">
                    {queuedMonths.length > 0
                      ? t('please_update_saldo_to_continue')
                      : t('you_can_continue_working_now')}
                  </DialogDescription>
                </div>
                <MonthPicker
                  readOnly
                  value={`${year}-${month}-01`}
                  onChange={() => {}}
                />
              </DialogHeader>

              <div className="flex-1 overflow-auto scrollbar relative">
                {isFetching ? <LoadingOverlay /> : null}
                {queuedMonths.length === 0 ? (
                  <div className="flex h-full flex-col">
                    <div className="flex-1 grid place-items-center">
                      <div className="flex flex-col items-center gap-2.5">
                        <DotLottieReact
                          autoplay
                          src="/lotties/success.json"
                          className="size-60"
                        />
                      </div>
                    </div>
                  </div>
                ) : (
                  <EditorTable
                    columnDefs={columnDefs}
                    form={form}
                    arrayField="organizations"
                    pinnedBottomRowData={totalRow}
                  />
                )}
              </div>

              <DialogFooter className="flex items-center justify-end p-5 gap-5456  ">
                {queuedMonths.length === 0 ? (
                  <Button
                    variant="outline"
                    onClick={close}
                  >
                    {t('close')}
                  </Button>
                ) : (
                  <Button
                    isPending={isPending}
                    isDisabled={isPending}
                    onClick={onSubmit}
                  >
                    {t('next')}
                    <ArrowRight className="btn-icon" />
                  </Button>
                )}
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </DialogOverlay>
    </DialogTrigger>
  )
}
