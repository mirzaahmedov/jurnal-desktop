import { type FC, type ReactNode } from 'react'

interface DetailsProps {
  children: ReactNode
  className?: string
}

interface DetailsSectionProps {
  title?: ReactNode
  children: ReactNode
  className?: string
}

interface DetailsItemProps {
  label: ReactNode
  value: ReactNode
  children?: ReactNode
  className?: string
}

export const Details: FC<DetailsProps> & {
  Section: FC<DetailsSectionProps>
  Item: FC<DetailsItemProps>
} = ({ children, className = '' }) => <div className={`details ${className}`}>{children}</div>

const Section: FC<DetailsSectionProps> = ({ title, children, className = '' }) => (
  <section className={`details-section mb-6 ${className}`}>
    {title && <h3 className="mb-4 text-lg font-semibold text-foreground">{title}</h3>}
    <div>{children}</div>
  </section>
)

const Item: FC<DetailsItemProps> = ({ label, value, children, className = '' }) => (
  <div className={`details-item flex items-start mb-3 ${className}`}>
    <div className="min-w-[120px] font-medium text-muted-foreground">{label}:</div>
    <div className="flex-1">{value}</div>
    {children}
  </div>
)

Details.Section = Section
Details.Item = Item
