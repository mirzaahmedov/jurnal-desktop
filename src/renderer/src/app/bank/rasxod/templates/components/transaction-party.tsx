import { Flex, Label, TextBox } from '@/common/components/pdf'

type TransactionPartyProps = {
  type: 'debtor' | 'creditor'
  name: string
  raschet: string
  inn: string
  bank: string
  mfo: string
}
const TransactionParty = ({ type, name, raschet, inn, bank, mfo }: TransactionPartyProps) => {
  return (
    <Flex direction="column" alignItems="stretch" style={{ gap: 2, marginTop: 4 }}>
      <Flex>
        <Label style={{ width: 100 }}>
          {type === 'debtor' ? 'Mablag`larni to`lovchining' : 'Mablag`larni oluvchining'} nomi
        </Label>
        <TextBox fullWidth style={{ fontSize: 10, textDecoration: 'none' }}>
          {name}
        </TextBox>
      </Flex>

      <Flex>
        <Label style={{ fontWeight: 'bold' }}>{type === 'debtor' ? 'DEBET' : 'KREDIT'}</Label>
      </Flex>

      <Flex justifyContent="space-between" alignItems="flex-start">
        <Label style={{ width: 100 }}>
          {type === 'debtor' ? 'Mablag`larni to`lovchining' : 'Mablag`larni oluvchining'}{' '}
          hisobvarag`i
        </Label>
        <TextBox style={{ flex: 1, letterSpacing: 5 }}>{raschet}</TextBox>
        <Label style={{ width: 60 }}>
          {type === 'debtor' ? 'Mablag`larni to`lovchining' : 'Mablag`larni oluvchining'} STIRi
        </Label>
        <TextBox style={{ letterSpacing: 5 }}>{inn}</TextBox>
      </Flex>

      <Flex justifyContent="space-between">
        <Label style={{ width: 100 }}>
          {type === 'debtor' ? 'Mablag`larni to`lovchining' : 'Mablag`larni oluvchining'} banki nomi
        </Label>
        <TextBox style={{ flex: 1, fontSize: 10, minHeight: 24 }}>{bank}</TextBox>
        <Label style={{ width: 100 }}>
          {type === 'debtor' ? 'Mablag`larni to`lovchining' : 'Mablag`larni oluvchining'} banki kodi
        </Label>
        <TextBox style={{ letterSpacing: 5 }}>{mfo}</TextBox>
      </Flex>
    </Flex>
  )
}

export { TransactionParty }
