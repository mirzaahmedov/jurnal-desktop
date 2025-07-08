import type { AutocompleteProps, Key } from 'react-aria-components'

import { Autocomplete, Menu, MenuItem } from 'react-aria-components'

import { SearchField } from './searchfield'

interface JollyAutocompleteProps<T extends object> extends Omit<AutocompleteProps, 'children'> {
  label?: string
  placeholder?: string
  items?: Iterable<T>
  children: React.ReactNode | ((item: T) => React.ReactNode)
  onAction?: (id: Key) => void
}

export const JollyAutocomplete = <T extends object>({
  items,
  children,
  onAction,
  ...props
}: JollyAutocompleteProps<T>) => {
  return (
    <div className="my-autocomplete">
      <Autocomplete {...props}>
        <SearchField />
        <Menu
          items={items}
          onAction={onAction}
        >
          {children}
        </Menu>
      </Autocomplete>
    </div>
  )
}
