import type { AdminDashboardBank, AdminDashboardKassa } from '@/app/super-admin/dashboard/model'

import { useEffect, useState } from 'react'

import { useQuery } from '@tanstack/react-query'
import { ArrowLeft } from 'lucide-react'
import { useTranslation } from 'react-i18next'

import { AdminDashboardPieChartContainer } from '@/app/super-admin/dashboard/components/admin-dashboard-pie-chart-container'
import { AdminDashboardPodotchetTable } from '@/app/super-admin/dashboard/components/admin-dashboard-podotchet-table'
import { AdminDashboardRegionsList } from '@/app/super-admin/dashboard/components/admin-dashboard-regions-list'
import { AdminDashboardService } from '@/app/super-admin/dashboard/service'
import { JollyDatePicker } from '@/common/components/jolly-date-picker'
import { Button } from '@/common/components/jolly/button'
import { Badge } from '@/common/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/common/components/ui/card'
import { useLayout } from '@/common/layout'
import { formatDate } from '@/common/lib/date'

const CARD_HEIGHT = 550

const AdminDashboardPage = () => {
  const [date, setDate] = useState(formatDate(new Date()))

  const [isKassaMaximized, setKassaMaximized] = useState(false)
  const [isBankMaximized, setBankMaximized] = useState(false)

  const [selectedKassa, setSelectedKassa] = useState<AdminDashboardKassa>()
  const [selectedBank, setSelectedBank] = useState<AdminDashboardBank>()

  const { t } = useTranslation(['dashboard'])

  const setLayout = useLayout()
  const dashboardKassaQuery = useQuery({
    queryKey: [
      AdminDashboardService.QueryKeys.Kassa,
      { to: date, region_id: undefined, budjet_id: undefined }
    ],
    queryFn: AdminDashboardService.getKassa
  })
  const dashboardBankQuery = useQuery({
    queryKey: [
      AdminDashboardService.QueryKeys.Bank,
      { to: date, region_id: undefined, budjet_id: undefined }
    ],
    queryFn: AdminDashboardService.getBank
  })

  useEffect(() => {
    setLayout({
      title: t('pages.main', { ns: 'app' }),
      breadcrumbs: [
        {
          title: t('pages.admin', { ns: 'app' })
        }
      ]
    })
  }, [setLayout, t])

  return (
    <div className="p-5 flex-1 flex flex-col gap-5 overflow-y-auto scrollbar">
      <div className="flex items-center gap-5 justify-between">
        <JollyDatePicker
          value={date ?? ''}
          onChange={setDate}
        />
      </div>
      <div className="grid grid-cols-2 gap-5">
        <div
          style={{
            height: CARD_HEIGHT
          }}
        >
          <Card
            style={{
              height: !isKassaMaximized ? CARD_HEIGHT : undefined
            }}
            className="flex flex-col overflow-hidden relative z-100"
          >
            <CardHeader className="w-full flex flex-row items-center gap-5 space-y-0">
              {selectedKassa ? (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setSelectedKassa(undefined)}
                  className="-my-20"
                >
                  <ArrowLeft />
                </Button>
              ) : null}
              <CardTitle className="flex-1">{t('kassa')}</CardTitle>
              {selectedKassa ? (
                <Badge
                  variant="secondary"
                  className="rounded-lg uppercase"
                >
                  {selectedKassa.name}
                </Badge>
              ) : null}
            </CardHeader>
            <CardContent className="flex-1 min-h-0 flex flex-col">
              {selectedKassa ? (
                <AdminDashboardPieChartContainer
                  items={selectedKassa.budjets.flatMap((budjet) =>
                    budjet.main_schets.map((item) => ({
                      ...item,
                      name: item.account_number,
                      summa: item.kassa.summa
                    }))
                  )}
                />
              ) : (
                <AdminDashboardPieChartContainer
                  items={dashboardKassaQuery.data ?? []}
                  onSelect={(item) => setSelectedKassa({ ...item })}
                />
              )}
              {selectedKassa ? (
                <AdminDashboardRegionsList
                  items={selectedKassa.budjets.flatMap((budjet) =>
                    budjet.main_schets.map((item) => ({
                      ...item,
                      name: item.account_number,
                      summa: item.kassa.summa
                    }))
                  )}
                  isMaximized={isKassaMaximized}
                  setMaximized={setKassaMaximized}
                  onToggleMaximized={() => setKassaMaximized((prev) => !prev)}
                />
              ) : (
                <AdminDashboardRegionsList
                  items={dashboardKassaQuery.data ?? []}
                  isMaximized={isKassaMaximized}
                  setMaximized={setKassaMaximized}
                  onToggleMaximized={() => setKassaMaximized((prev) => !prev)}
                  onSelect={setSelectedKassa}
                />
              )}
            </CardContent>
          </Card>
        </div>

        <div
          style={{
            height: CARD_HEIGHT
          }}
        >
          <Card
            style={{
              height: !isBankMaximized ? CARD_HEIGHT : undefined
            }}
            className="flex flex-col overflow-hidden relative z-100"
          >
            <CardHeader className="w-full flex flex-row items-center gap-5 space-y-0">
              {selectedBank ? (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setSelectedBank(undefined)}
                  className="-my-20"
                >
                  <ArrowLeft />
                </Button>
              ) : null}
              <CardTitle className="flex-1">{t('bank')}</CardTitle>
              {selectedBank ? (
                <Badge
                  variant="secondary"
                  className="rounded-lg uppercase"
                >
                  {selectedBank.name}
                </Badge>
              ) : null}
            </CardHeader>
            <CardContent className="flex-1 min-h-0 flex flex-col">
              {selectedBank ? (
                <AdminDashboardPieChartContainer
                  items={selectedBank.budjets.flatMap((budjet) =>
                    budjet.main_schets.map((item) => ({
                      ...item,
                      name: item.account_number,
                      summa: item.bank.summa
                    }))
                  )}
                />
              ) : (
                <AdminDashboardPieChartContainer
                  items={dashboardBankQuery.data ?? []}
                  onSelect={(item) => setSelectedBank({ ...item })}
                />
              )}

              {selectedBank ? (
                <AdminDashboardRegionsList
                  items={selectedBank.budjets.flatMap((budjet) =>
                    budjet.main_schets.map((item) => ({
                      ...item,
                      name: item.account_number,
                      summa: item.bank.summa
                    }))
                  )}
                  isMaximized={isBankMaximized}
                  onToggleMaximized={() => setBankMaximized((prev) => !prev)}
                  setMaximized={setBankMaximized}
                />
              ) : (
                <AdminDashboardRegionsList
                  items={dashboardBankQuery.data ?? []}
                  isMaximized={isBankMaximized}
                  onToggleMaximized={() => setBankMaximized((prev) => !prev)}
                  setMaximized={setBankMaximized}
                  onSelect={setSelectedBank}
                />
              )}
            </CardContent>
          </Card>
        </div>

        <div className="col-span-full">
          <AdminDashboardPodotchetTable date={date} />
        </div>
      </div>
    </div>
  )
}

export default AdminDashboardPage
