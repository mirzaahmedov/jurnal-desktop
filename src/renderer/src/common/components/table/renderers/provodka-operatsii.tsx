import { ExpandableList } from './expandable-list'

interface ProvodkaChild {
  provodki_schet: string
  provodki_sub_schet: string
}

export interface ProvodkaCellProps {
  provodki: ProvodkaChild[]
}
export const ProvodkaCell = ({ provodki }: ProvodkaCellProps) => {
  return (
    <ExpandableList
      items={provodki}
      renderItem={(provodka) => (
        <div className="flex items-center">
          <span>{provodka.provodki_schet}</span>-<span>{provodka.provodki_sub_schet}</span>
        </div>
      )}
    />
  )
}
