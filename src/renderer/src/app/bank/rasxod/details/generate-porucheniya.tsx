import { MainSchet, Organization } from '@renderer/common/models'

import { Button } from '@renderer/common/components/ui/button'
import { ButtonHTMLAttributes } from 'react'
import { LoadingSpinner } from '@renderer/common/components'
import { Printer } from 'lucide-react'
import { RasxodPayloadType } from '../service'
import { formatLocaleDate } from '@renderer/common/lib/format'
import { generatePorucheniya } from '../templates/excel/porucheniya'
import { generatePorucheniyaNalog } from '../templates/excel/porucheniya_nalog'
import { numberToWords } from '@renderer/common/lib/utils'
import { saveAs } from 'file-saver'
import { useMutation } from '@tanstack/react-query'
import { useToast } from '@renderer/common/hooks'

type GeneratePorucheniyaParams = Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'type'> & {
  type: 'porucheniya' | 'porucheniya_nalog'
  fileName: string
  buttonText: string
  data: {
    rasxod: RasxodPayloadType
    main_schet: MainSchet
    organization: Organization
  }
}
export const GeneratePorucheniya = ({
  data,
  fileName,
  type,
  buttonText,
  ...props
}: GeneratePorucheniyaParams) => {
  const { toast } = useToast()
  const { mutate: generateDocument, isPending: isGeneratingDocument } = useMutation({
    mutationFn: async () => {
      const { rasxod, main_schet, organization } = data
      const params = {
        type: type,
        doc_num: rasxod.doc_num,
        doc_date: formatLocaleDate(rasxod.doc_date),
        debtor_name: main_schet.tashkilot_nomi,
        debtor_raschet: main_schet.account_number,
        debtor_inn: main_schet.tashkilot_inn,
        debtor_bank: main_schet.tashkilot_bank,
        debtor_mfo: main_schet.tashkilot_mfo,
        creditor_name: organization.name,
        creditor_raschet: organization.raschet_schet,
        creditor_raschet_gazna: organization.raschet_schet_gazna,
        creditor_inn: organization.inn,
        creditor_bank: organization.bank_klient,
        creditor_mfo: organization.mfo,
        summa: rasxod.summa!,
        summaWords: numberToWords(rasxod.summa!),
        opisanie: rasxod.opisanie ?? ' ',
        rukovoditel: rasxod.rukovoditel ?? ' ',
        glav_buxgalter: rasxod.glav_buxgalter ?? ' '
      }
      const blob = await (type === 'porucheniya' ? generatePorucheniya : generatePorucheniyaNalog)(
        params
      )
      saveAs(blob, fileName)
    },
    onError(error) {
      toast({
        title: 'Ошибка при генерации файла',
        description: error.message,
        variant: 'destructive'
      })
    }
  })

  return (
    <Button
      type="button"
      variant="ghost"
      onClick={() => generateDocument()}
      disabled={isGeneratingDocument}
      {...props}
    >
      {isGeneratingDocument ? (
        <>
          <LoadingSpinner className="btn-icon icon-start" />
          Загрузка
        </>
      ) : (
        <>
          <Printer className="btn-icon icon-start !size-4" />
          {buttonText}
        </>
      )}
    </Button>
  )
}
