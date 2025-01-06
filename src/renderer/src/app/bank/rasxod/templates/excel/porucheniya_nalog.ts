import { Workbook, Worksheet } from 'exceljs'
import { array, assign, drawBorder, textbox } from './utils'

type GeneratePorucheniyaParams = {
  doc_num: string
  doc_date: string

  debtor_name: string
  debtor_raschet: string
  debtor_inn: string
  debtor_bank: string
  debtor_mfo: string

  creditor_name: string
  creditor_raschet: string
  creditor_raschet_gazna: string
  creditor_inn: string
  creditor_bank: string
  creditor_mfo: string

  summa: number
  summaWords: string
  opisanie?: string
  rukovoditel: null | string
  glav_buxgalter: null | string
}
export const generatePorucheniyaNalog = async (params: GeneratePorucheniyaParams) => {
  const rows = array(
    {
      1: array({
        1: 'TO`LOV TOPSHIRIQNOMASI RAQAMI',
        4: params.doc_num
      }),
      3: array({
        1: 'Hujjat sanasi',
        2: params.doc_date,
        5: 'Valyutalashtirish sanasi',
        8: params.doc_date
      }),
      5: array({
        1: 'Mablag`larni to`lovchining nomi',
        2: params.debtor_name
      }),
      7: ['DEBET'],
      9: array({
        1: 'Mablag`larni to`lovchining hisobvarag`i',
        2: params.debtor_raschet,
        5: 'Mablag`larni to`lovchining STIRi',
        8: params.debtor_inn
      }),
      11: array({
        1: 'Mablag`larni to`lovchining banki nomi',
        2: params.debtor_bank,
        6: 'Mablag`larni to`lovchining banki kodi',
        8: params.debtor_mfo
      }),
      13: ['Summa', params.summa],
      15: array({
        1: 'Mablag`larni oluvchining nomi',
        2: params.creditor_name
      }),
      17: ['KREDIT'],
      19: array({
        1: 'Mablag`larni oluvchining hisobvarag`i',
        2: params.creditor_raschet,
        5: 'Mablag`larni oluvchining STIRi',
        8: params.creditor_inn
      }),
      21: array({
        1: 'Mablag`larni oluvchining banki nomi',
        2: params.creditor_bank,
        6: 'Mablag`larni oluvchining banki kodi',
        8: params.creditor_mfo
      }),
      23: array({
        1: 'Summa (so`z bilan)',
        2: params.summaWords
      }),
      25: array({
        1: "Daromad shaxsiy g'azna hisob varag'i",
        2: params.creditor_raschet_gazna
      }),
      27: array({
        1: 'To`lov maqsadi',
        2: params.opisanie
      }),
      29: array({
        1: 'Rahbar',
        2: params.rukovoditel,
        5: 'Bosh buхgalter',
        8: params.glav_buxgalter
      }),
      32: array({
        3: 'Tekshirilgan',
        5: 'Ma`qullangan',
        7: 'Bank tomonidan o`tkazilgan'
      }),
      34: array({
        2: 'Bank',
        3: '',
        5: '',
        7: ''
      })
    },
    35,
    ['']
  )

  const workbook = new Workbook()
  const sheet = workbook.addWorksheet('Поручения')

  sheet.pageSetup = {
    paperSize: 9,
    orientation: 'portrait',
    margins: {
      top: 0.3,
      left: 0.3,
      right: 0.3,
      bottom: 0.3,
      header: 0,
      footer: 0
    }
  }
  sheet.columns = [
    { width: 26 },
    { width: 5 },
    { width: 14 },
    { width: 4 },
    { width: 14 },
    { width: 4 },
    { width: 13 },
    { width: 13 },
    { width: 4 }
  ]

  sheet.addRows([...rows, [''], [''], ...rows])

  sheet.eachRow((row) => {
    row.eachCell((cell) => {
      cell.font = {
        name: 'Times New Roman',
        family: 1,
        size: 8,
        bold: true
      }
      cell.border = {}
      cell.alignment = {
        wrapText: true,
        vertical: 'middle',
        horizontal: 'center'
      }
    })
  })

  sheet.getColumn(1).eachCell((cell) => {
    cell.alignment = assign(cell.alignment, {
      vertical: 'top',
      horizontal: 'left'
    })
  })

  renderSingleCopy(sheet)

  sheet.getRow(37).border = {
    top: { style: 'dashed' }
  }
  sheet.getRow(37).height = 4

  renderSingleCopy(sheet, 38)

  sheet.eachRow((row, i) => {
    if ([23, 27, 60, 64].includes(i)) {
      row.height = 35
    }
  })
  sheet.eachRow((row, i) => {
    if ([7, 17, 44, 54].includes(i)) {
      row.height = 10
    }
  })

  const buffer = await workbook.xlsx.writeBuffer()
  const blob = new Blob([buffer], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  })

  return blob
}

const renderSingleCopy = (sheet: Worksheet, startIndex: number = 1) => {
  let rowIndex = startIndex
  sheet.mergeCells(rowIndex, 1, rowIndex, 3)
  sheet.mergeCells(rowIndex, 4, rowIndex, 6)
  sheet.getRow(rowIndex).eachCell((cell, i) => {
    if (i === 4) {
      textbox(cell, true)
    }
  })

  rowIndex = startIndex + 2
  sheet.mergeCells(rowIndex, 2, rowIndex, 4)
  sheet.mergeCells(rowIndex, 5, rowIndex, 7)
  sheet.mergeCells(rowIndex, 8, rowIndex, 9)
  sheet.getRow(rowIndex).eachCell((cell, i) => {
    if (i === 2 || i === 8) {
      textbox(cell, true)
    }
  })

  rowIndex = startIndex + 4
  renderCounterAgent(sheet, rowIndex)

  rowIndex = startIndex + 12
  renderSingleTextbox(sheet, rowIndex)

  rowIndex = startIndex + 14
  renderCounterAgent(sheet, rowIndex)

  rowIndex = startIndex + 22
  renderSingleTextbox(sheet, rowIndex, true)

  rowIndex = startIndex + 24
  renderSingleTextbox(sheet, rowIndex, true)

  rowIndex = startIndex + 26
  renderSingleTextbox(sheet, rowIndex, true)

  rowIndex = startIndex + 28
  sheet.mergeCells(rowIndex, 2, rowIndex, 4)
  sheet.mergeCells(rowIndex, 5, rowIndex, 7)
  sheet.mergeCells(rowIndex, 8, rowIndex, 9)
  sheet.getRow(rowIndex).eachCell((cell, i) => {
    cell.alignment = assign(cell.alignment, {
      vertical: 'middle'
    })
    if (i === 2 || i === 8) {
      textbox(cell)
    }
  })

  rowIndex = startIndex + 33
  renderSignatures(sheet, rowIndex)

  sheet.eachRow((row, i) => {
    if (
      [2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22, 24, 26, 28, 31, 33, 35]
        .map((val) => val - 1 + startIndex)
        .includes(i)
    ) {
      row.height = 4
    }
  })
}

const renderCounterAgent = (sheet: Worksheet, rowIndex: number) => {
  sheet.mergeCells(rowIndex, 2, rowIndex, 9)
  sheet.getRow(rowIndex).eachCell((cell, i) => {
    if (i === 2) {
      textbox(cell)
    }
  })

  sheet.mergeCells(rowIndex + 4, 2, rowIndex + 4, 4)
  sheet.mergeCells(rowIndex + 4, 5, rowIndex + 4, 7)
  sheet.mergeCells(rowIndex + 4, 8, rowIndex + 4, 9)
  sheet.getRow(rowIndex + 4).eachCell((cell, i) => {
    if (i === 2 || i === 8) {
      textbox(cell, true)
    }
  })

  sheet.mergeCells(rowIndex + 6, 2, rowIndex + 6, 5)
  sheet.mergeCells(rowIndex + 6, 6, rowIndex + 6, 7)
  sheet.mergeCells(rowIndex + 6, 8, rowIndex + 6, 9)
  sheet.getRow(rowIndex + 6).eachCell((cell, i) => {
    if (i === 2) {
      textbox(cell)
    }
    if (i === 8) {
      textbox(cell, true)
    }
  })
}

const renderSingleTextbox = (sheet: Worksheet, rowIndex: number, bold = false) => {
  sheet.mergeCells(rowIndex, 2, rowIndex, 9)
  sheet.getRow(rowIndex).eachCell((cell, i) => {
    if (i === 2) {
      textbox(cell)
      cell.font = assign(cell.font, {
        bold
      })
    }
  })
}

const renderSignatures = (sheet: Worksheet, rowIndex: number) => {
  sheet.getRow(rowIndex).eachCell((cell, i) => {
    if (i === 3 || i === 5 || i === 7) {
      textbox(cell, true)
    }
  })
  sheet.mergeCells(rowIndex - 2, 7, rowIndex - 2, 8)
  sheet.mergeCells(rowIndex, 7, rowIndex, 8)

  drawBorder(sheet, [2, rowIndex - 3, 9, rowIndex + 1])
}
