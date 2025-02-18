// import { Button } from '@renderer/common/components/ui/button'
// import { useToggle } from '@renderer/common/hooks'
// import { ShartnomaSmetaGrafikGeneratePDFDocumentDialog } from './dialog/ShartnomaGrafikDialog'
import { PDFViewer } from '@react-pdf/renderer'
import { DocumentOrientation } from '@renderer/common/widget/form'

import { ShartnomaGrafikPDFDocument } from './ShartnomaGrafik'
import { data } from './data'

export const DemoShartnomaGrafik = () => {
  // const toggle = useToggle()
  // return (
  //   <div className="flex-1 w-full h-full">
  //     <Button onClick={toggle.open}>Open Dialog</Button>
  //     <ShartnomaSmetaGrafikGeneratePDFDocumentDialog
  //       open={toggle.isOpen}
  //       onChange={toggle.setOpen}
  //       doc_date={data.createdDate}
  //       doc_num={'324A'}
  //       grafiks={data.grafiks}
  //       main_schet={{
  //         id: 14,
  //         account_number: '2020800000647495001',
  //         spravochnik_budjet_name_id: 1,
  //         tashkilot_nomi: 'navoiy FVB',
  //         tashkilot_bank: 'ТОШКЕНТ Ш., "ТУРОНБАНК" АТ БАНКИНИНГ БОШ ОФИСИ',
  //         tashkilot_mfo: '00446',
  //         tashkilot_inn: '309170108',
  //         account_name: 'асосий   тест',
  //         jur1_schet: '120',
  //         jur1_subschet: '0',
  //         jur2_schet: '100',
  //         jur2_subschet: '0',
  //         jur3_schet: '159',
  //         jur3_subschet: '0',
  //         jur4_schet: '172',
  //         jur4_subschet: '0',
  //         budjet_name: 'Respublika budjeti'
  //       }}
  //       organization={{
  //         id: 19,
  //         name: '"Навоий ХЭТК" АЖ',
  //         bank_klient: 'TOShKENT Sh., "UZSANOATKURILIShBANKI" ATB BOSh OFISI',
  //         mfo: '00440',
  //         inn: '306350099',
  //         okonx: '0097456',
  //         gaznas: [
  //           {
  //             id: 3,
  //             spravochnik_organization_id: 19,
  //             raschet_schet_gazna: '100004'
  //           },
  //           {
  //             id: 5,
  //             spravochnik_organization_id: 19,
  //             raschet_schet_gazna: '3666566555666'
  //           },
  //           {
  //             id: 18,
  //             spravochnik_organization_id: 19,
  //             raschet_schet_gazna: '0'
  //           }
  //         ],
  //         account_numbers: [
  //           {
  //             id: 19,
  //             spravochnik_organization_id: 19,
  //             raschet_schet: '22636000905063172655'
  //           }
  //         ],
  //         childs: []
  //       }}
  //     />
  //   </div>
  // )

  return (
    <PDFViewer>
      <ShartnomaGrafikPDFDocument
        chapter="1"
        subchapter="1"
        section="1"
        createdDate="2024-01-01"
        glav_mib="Bekzod"
        rukovoditel="Mirzaahmedov"
        grafiks={data.grafiks}
        orientation={DocumentOrientation.LANDSCAPE}
        paddingBottom={10}
        paddingTop={10}
        paddingLeft={10}
        paddingRight={10}
        singlePage={true}
        paymentDetails="Payment"
        shartnomaDetails="Shartnoma"
      />
    </PDFViewer>
  )
}
