import { StyleSheet, Text } from '@react-pdf/renderer'

import { Flex } from '@/common/components/pdf'

type DocumentInfoProps = {
  contractDetails: string
  createdDate: string
  section: string
  subchapter: string
  chapter: string
}
const DocumentInfo = ({
  contractDetails,
  createdDate,
  section,
  subchapter,
  chapter
}: DocumentInfoProps) => {
  return (
    <>
      <Text style={styles.description}>{contractDetails}</Text>
      <Flex>
        <Flex.Item>
          <Flex
            direction="column"
            alignItems="stretch"
            justifyContent="flex-start"
            style={{ maxWidth: 250, gap: 2 }}
          >
            <Flex>
              <Text style={{ flex: 1 }}>Бўлим</Text>
              <Text style={{ flex: 1 }}>{section}</Text>
            </Flex>
            <Flex>
              <Text style={{ flex: 1 }}>Кичик бўлим</Text>
              <Text style={{ flex: 1 }}>{subchapter}</Text>
            </Flex>
            <Flex>
              <Text style={{ flex: 1 }}>Боб</Text>
              <Text style={{ flex: 1 }}>{chapter}</Text>
            </Flex>
          </Flex>
        </Flex.Item>
        <Flex.Item>
          <Text
            style={{
              fontStyle: 'italic',
              textAlign: 'center'
            }}
          >
            дс1 от {createdDate}г.
          </Text>
        </Flex.Item>
      </Flex>
    </>
  )
}

const styles = StyleSheet.create({
  description: {
    paddingHorizontal: 20,
    textAlign: 'center',
    fontStyle: 'italic',
    fontWeight: 'bold'
  }
})

export { DocumentInfo }
