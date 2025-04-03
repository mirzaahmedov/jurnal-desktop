import { ExpandableList } from './expandable-list'

interface ProvodkaChild {
  provodki_schet: string
  provodki_sub_schet: string
}

export interface ProvodkaOperatsiiCellProps {
  provodki: ProvodkaChild[]
}
export const ProvodkaOperatsiiCell = ({ provodki }: ProvodkaOperatsiiCellProps) => {
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
