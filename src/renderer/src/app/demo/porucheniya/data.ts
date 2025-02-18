import { type PaperSheetProps, PorucheniyaType } from './PaperSheet'

export const data: PaperSheetProps = {
  type: PorucheniyaType.TAX,

  doc_num: '47',
  doc_date: '03.02.2025',

  debtor_name: 'Узбекистан Респуликаси ФВВ ЁХ ва ФВМИТИ',
  debtor_raschet: '202350000000000000012000000',
  debtor_inn: '12345612300000',
  debtor_bank: 'ТОШКЕНТ Ш., "ТУРОНБАНК" АТ БАНКИНИНГ БОШ ОФИСИ',
  debtor_mfo: '00440',

  creditor_name: '"SAID BARAKA KENJAEV" MCHJ',
  creditor_raschet: '22626000104600588001',
  creditor_raschet_gazna: '0',
  creditor_inn: '300349394',
  creditor_bank: 'Навоий ш, "Ипак йули " АИТ банкининг Навоий филиали',
  creditor_mfo: '00199',

  summa: 200000,
  summaWords: 'Ikki yuz ming so`m 00 tiyin',
  opisanie:
    '№ 100-сонли 01.01.2001 йил кунги шартномага асосан _________________________________ Ст: (субсчет)',
  rukovoditel: 'Mirzaahmedov Bekzod',
  glav_buxgalter: 'Sardor Karimov'
}
