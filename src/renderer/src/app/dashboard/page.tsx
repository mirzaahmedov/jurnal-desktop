import { useQuery } from '@tanstack/react-query'
import { BankBalanceBarChart } from './components/bank-balance'
import KassaBalance from './components/kassa-balance'
import { mainSchetQueryKeys, mainSchetService } from '../region-spravochnik/main-schet'
import { LoadingOverlay } from '@renderer/common/components'

const DashboardPage = () => {
  const { data: mainSchets, isFetching } = useQuery({
    queryKey: [mainSchetQueryKeys.getAll],
    queryFn: mainSchetService.getAll
  })

  return (
    <div className="grid grid-cols-3 p-10 gap-10">
      {isFetching ? (
        <LoadingOverlay />
      ) : (
        <>
          <BankBalanceBarChart mainSchets={mainSchets?.data ?? []} />
          <KassaBalance />
          <BankBalanceBarChart mainSchets={mainSchets?.data ?? []} />
        </>
      )}
    </div>
  )
}

export default DashboardPage
