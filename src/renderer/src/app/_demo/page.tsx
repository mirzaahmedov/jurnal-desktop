// const childs: RasxodProvodkaFormValues[] = [
//   {
//     name: 'Mahsulot nomi',
//     inventar_num: '10000',
//     edin: 'juft',
//     kol: 4,
//     sena: 1000000
//   }
// ]

const DemoPage = () => {
  return (
    <div className="p-10 flex-1 flex flex-col gap-5 overflow-y-auto scrollbar">
      <table>
        <thead>
          <tr>№</tr>
          <tr>Наименование</tr>
          <tr>Инв. №</tr>
          <tr>Ед.изм</tr>
          <tr>Треб</tr>
          <tr>Отпущ</tr>
          <tr>Цена</tr>
          <tr>Сумма</tr>
          <tr>Дебет</tr>
          <tr>Кредит</tr>
        </thead>
        <tbody></tbody>
      </table>
    </div>
  )
}

export default DemoPage
