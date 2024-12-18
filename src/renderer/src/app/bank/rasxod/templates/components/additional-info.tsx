import { Flex, Label, TextBox } from '@/common/components/pdf'
import { splitStringByLength } from '@/common/lib/utils'

type AdditionalInfoProps = {
  type: 'normal' | 'tax'

  summaWords: string
  creditor_raschet_gazna?: string
  opisanie: string
}
const AdditionalInfo = ({
  type,
  summaWords,
  creditor_raschet_gazna,
  opisanie
}: AdditionalInfoProps) => {
  return (
    <Flex
      direction="column"
      alignItems="stretch"
      style={{ gap: 2 }}
    >
      <Flex>
        <Label style={{ width: 100 }}>Summa (so`z bilan)</Label>
        <TextBox
          fullWidth
          style={{
            paddingVertical: 2,
            fontSize: 8,
            fontStyle: 'italic',
            minHeight: 20
          }}
        >
          {summaWords}
        </TextBox>
      </Flex>

      {type === 'tax' ? (
        <Flex>
          <Label style={{ width: 100 }}>Daromad shaxsiy g'azna hisob varag'i</Label>
          <TextBox
            fullWidth
            style={{
              letterSpacing: 5
            }}
          >
            {splitStringByLength(creditor_raschet_gazna || ' ', 4).join(' ')}
          </TextBox>
        </Flex>
      ) : null}

      <Flex>
        <Label style={{ width: 100 }}>To`lov maqsadi</Label>
        <TextBox
          fullWidth
          style={{
            paddingVertical: 2,
            fontSize: 8,
            fontWeight: 'normal',
            minHeight: 20
          }}
        >
          {opisanie}
        </TextBox>
      </Flex>
    </Flex>
  )
}

export { AdditionalInfo }
