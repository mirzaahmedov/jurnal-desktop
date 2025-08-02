import type { EditableTableProps } from './interface'
import type { ArrayPath, FieldArrayWithId, Path } from 'react-hook-form'

import {
  type HTMLAttributes,
  type ReactNode,
  useImperativeHandle,
  useMemo,
  useRef,
  useState
} from 'react'

import { CircleMinus, CirclePlus, CopyPlus } from 'lucide-react'
import { Controller, type FieldErrors, useFieldArray } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import AutoSizer from 'react-virtualized-auto-sizer'
import { FixedSizeList, type ListChildComponentProps } from 'react-window'

import { Button } from '@/common/components/ui/button'
import { useEventCallback } from '@/common/hooks'
import { useIsScrollable } from '@/common/hooks/use-is-scrollable'
import { cn } from '@/common/lib/utils'

import { EmptyList } from '../empty-states'
import { getHeaderGroups } from '../generic-table/utils'
import { EditableTableCell, EditableTableHead, EditableTableRow } from './components'
import { getAccessorColumns } from './utils'

interface TableAction {
  key: string
  onPress: Function
  render: (args: { rowIndex: number; row: any; rows: any[] }) => ReactNode
}

export const EditableTable = <T extends object, F extends ArrayPath<NoInfer<T>>>(
  props: EditableTableProps<T, F>
) => {
  const {
    tableRef,
    tabIndex,
    name,
    form,
    height,
    columnDefs,
    className,
    divProps,
    errors,
    placeholder,
    onCreate,
    onDelete,
    onDuplicate,
    onCellDoubleClick,
    validate,
    getEditorProps,
    getRowClassName,
    isRowVisible = () => true,
    params = {},
    methods
  } = props

  const headerRef = useRef<HTMLTableSectionElement>(null)
  const innerRef = useRef<HTMLTableElement>(null)
  const ref = tableRef || innerRef

  const { t } = useTranslation()
  const { setElementRef: setScrollerRef, isScrollable } = useIsScrollable()

  const fieldArray = useFieldArray({
    control: form.control,
    name
  })
  const fields = fieldArray.fields

  const onDeleteCallback = useEventCallback(onDelete)
  const onDuplicateCallback = useEventCallback(onDuplicate)
  const onCellDoubleClickCallback = useEventCallback(onCellDoubleClick)
  const validateCallback = useEventCallback(validate)
  const getEditorPropsCallback = useEventCallback(getEditorProps)
  const getRowClassNameCallback = useEventCallback(getRowClassName)

  useImperativeHandle(
    methods,
    () => ({
      scrollToRow: (rowIndex: number) => {
        const rowElement = ref.current?.querySelector(`[data-rowindex="${rowIndex}"]`)

        if (rowElement) {
          rowElement.scrollIntoView({
            behavior: 'smooth',
            block: 'nearest'
          })

          const observer = new IntersectionObserver(([entry], obs) => {
            if (entry.isIntersecting) {
              const inputElement = rowElement.querySelector(
                'input:not(:disabled), textarea:not(:disabled), select:not(:disabled)'
              ) as HTMLInputElement

              setTimeout(() => {
                inputElement?.focus?.({
                  preventScroll: true
                })
              }, 200)

              obs.disconnect()
            }
          })

          observer.observe(rowElement)
        }
      }
    }),
    []
  )

  const headerGroups = useMemo(() => getHeaderGroups(columnDefs), [columnDefs])

  const actions: TableAction[] = useMemo(
    () =>
      [
        {
          key: 'delete',
          onPress: onDeleteCallback,
          render: ({ rowIndex }) => (
            <Button
              tabIndex={tabIndex}
              type="button"
              variant="ghost"
              className="hover:bg-slate-50 hover:text-red-500 text-red-400"
              onClick={() => onDeleteCallback?.({ id: rowIndex, fieldArray })}
            >
              <CircleMinus className="btn-icon !mx-0" />
            </Button>
          )
        },
        {
          key: 'duplicate',
          onPress: onDuplicateCallback,
          render: ({ rowIndex }) => (
            <Button
              tabIndex={tabIndex}
              type="button"
              variant="ghost"
              className="hover:bg-slate-50 text-brand"
              onClick={() =>
                onDuplicateCallback?.({
                  index: rowIndex,
                  row: form.getValues(`${name}.${rowIndex}`),
                  fieldArray
                })
              }
            >
              <CopyPlus className="btn-icon !mx-0" />
            </Button>
          )
        }
      ].filter((action) => Boolean(action.onPress)) as TableAction[],
    [onDeleteCallback, onDuplicateCallback, tabIndex, form, name, fieldArray]
  )

  const lineNumberWidth = fields.length.toString().length * 20 + 20
  const actionsWidth = actions.length * 53

  // const OuterElement = useMemo(
  //   () =>
  //     forwardRef<HTMLDivElement>((props, ref) => (
  //       <div
  //         {...props}
  //         ref={ref}
  //         className="w-full scrollbar"
  //       />
  //     )),
  //   []
  // )
  // const InnerElement = useMemo(
  //   () =>
  //     forwardRef<HTMLTableSectionElement>((props, ref) => (
  //       <Table className={cn('w-full table-fixed border border-slate-200')}>
  //         <TableBody
  //           {...props}
  //           ref={ref}
  //         />
  //       </Table>
  //     )),
  //   []
  // )

  console.log({ isScrollable })

  return (
    <div
      {...divProps}
      onSubmit={(e) => {
        e.preventDefault()
        e.stopPropagation()
      }}
      onFocus={(e) => {
        e.target.scrollIntoView({
          behavior: 'smooth',
          block: 'nearest'
        })
      }}
      className={cn('relative bg-white flex flex-col', divProps?.className)}
    >
      <div className="relative w-full flex-1 overflow-x-auto">
        <div>
          <div
            ref={headerRef}
            className={cn('w-full shadow-sm scrollbar', isScrollable && 'overflow-y-scroll ')}
          >
            {Array.isArray(columnDefs)
              ? headerGroups.map((headerGroup, index) => (
                  <EditableTableRow key={index}>
                    {index === 0 ? (
                      <EditableTableHead
                        key="line_number"
                        className="px-3"
                        rowSpan={headerGroups.length}
                        style={{
                          width: 100
                        }}
                      ></EditableTableHead>
                    ) : null}
                    {Array.isArray(headerGroup)
                      ? headerGroup.map((column) => {
                          const {
                            _colSpan,
                            _rowSpan,
                            key,
                            header,
                            headerClassName,
                            width,
                            minWidth,
                            maxWidth
                          } = column
                          return (
                            <EditableTableHead
                              key={String(key)}
                              colSpan={_colSpan}
                              rowSpan={_rowSpan}
                              className={headerClassName}
                              style={{
                                flex: !width ? '1' : undefined,
                                width,
                                minWidth,
                                maxWidth
                              }}
                            >
                              {!header
                                ? t(key.toString())
                                : typeof header === 'string'
                                  ? t(header)
                                  : null}
                            </EditableTableHead>
                          )
                        })
                      : null}

                    {index === 0
                      ? actions.map((action, actionIndex) => (
                          <EditableTableHead
                            key={action.key}
                            className={cn(actionIndex === 0 && 'border-l')}
                            style={{
                              width: 100
                            }}
                          ></EditableTableHead>
                        ))
                      : null}
                  </EditableTableRow>
                ))
              : null}
          </div>

          <div
            className="flex-1 max-h-[480px]"
            style={{
              height: fields.length * 48
            }}
          >
            <AutoSizer disableWidth>
              {({ height }) =>
                Array.isArray(fields) && fields.length ? (
                  <FixedSizeList
                    outerRef={setScrollerRef}
                    itemCount={fields.length}
                    itemSize={48}
                    height={height}
                    width="100%"
                    itemKey={(index) => fields[index].id}
                    itemData={{
                      fields,
                      tabIndex,
                      name,
                      form,
                      columnDefs,
                      errors,
                      onCellDoubleClickCallback,
                      params,
                      validateCallback,
                      getEditorPropsCallback,
                      getRowClassNameCallback,
                      actions,
                      lineNumberWidth,
                      actionsWidth
                    }}
                    className="scrollbar"
                  >
                    {Row}
                  </FixedSizeList>
                ) : (
                  <div>
                    <EmptyList
                      iconProps={{
                        className: 'w-40'
                      }}
                    >
                      {placeholder}
                    </EmptyList>
                  </div>
                )
              }
            </AutoSizer>
          </div>
        </div>
      </div>

      {typeof onCreate === 'function' || props.footerRows ? (
        <div>
          {props.footerRows}
          {typeof onCreate === 'function' ? (
            <Button
              tabIndex={tabIndex}
              type="button"
              variant="ghost"
              className="w-full hover:bg-slate-50 border text-brand hover:text-brand rounded-none"
              onClick={() => onCreate({ fieldArray })}
            >
              <CirclePlus className="btn-icon icon-start" /> {t('add')}
            </Button>
          ) : null}
        </div>
      ) : null}
    </div>
  )
}

const Row = ({ index, style, data }: ListChildComponentProps<any>) => {
  const field = data.fields[index]
  return (
    <EditableTableRowRenderer
      key={field.id}
      fieldId={field.id}
      index={index}
      tabIndex={data.tabIndex}
      row={field as any}
      rows={data.fields as any}
      name={data.name as never}
      form={data.form}
      columnDefs={data.columnDefs}
      errors={data.errors}
      onCellDoubleClick={data.onCellDoubleClickCallback}
      params={data.params}
      validate={data.validateCallback}
      getEditorProps={data.getEditorPropsCallback}
      getRowClassName={data.getRowClassNameCallback}
      actions={data.actions}
      lineNumberWidth={data.lineNumberWidth}
      actionsWidth={data.actionsWidth}
      style={style}
    />
  )
}

interface EditableTableRowRendererProps<T extends object, F extends ArrayPath<NoInfer<T>>>
  extends Pick<
      EditableTableProps<T, F>,
      | 'validate'
      | 'name'
      | 'form'
      | 'params'
      | 'onCellDoubleClick'
      | 'errors'
      | 'columnDefs'
      | 'getEditorProps'
      | 'getRowClassName'
    >,
    HTMLAttributes<HTMLTableRowElement> {
  fieldId: string
  tabIndex?: number
  index: number
  row: FieldArrayWithId<T, F>
  rows: FieldArrayWithId<T, F>[]
  actions: TableAction[]
  lineNumberWidth?: number
  actionsWidth?: number
}
const EditableTableRowRenderer = <T extends object, R extends T[ArrayPath<NoInfer<T>>]>({
  tabIndex,
  fieldId,
  index,
  columnDefs,
  row,
  rows,
  name,
  form,
  errors,
  onCellDoubleClick,
  params,
  validate,
  getEditorProps,
  getRowClassName,
  actions,
  ...props
}: EditableTableRowRendererProps<T, R>) => {
  const [state, setState] = useState<Record<string, unknown>>({})

  const columns = useMemo(() => getAccessorColumns(columnDefs), [columnDefs])

  return (
    <EditableTableRow
      data-rowindex={index}
      className={getRowClassName?.({ index, row, rows })}
      focusable={rows.length > 1}
      {...props}
    >
      <EditableTableCell
        key="line_number"
        className="px-3 font-medium text-slate-500"
        style={{
          width: 100
        }}
      >
        {index + 1}
      </EditableTableCell>
      {Array.isArray(columnDefs)
        ? columns.map((column) => {
            const { key, Editor, className, width, minWidth, maxWidth } = column
            return (
              <Controller
                key={String(key)}
                control={form.control}
                name={`${name}.${index}.${String(key)}` as Path<T>}
                render={({ field }) => {
                  return (
                    <EditableTableCell
                      onDoubleClick={(event) => {
                        onCellDoubleClick?.({
                          column,
                          row,
                          rows,
                          value: field.value,
                          onChange: field.onChange,
                          event,
                          index
                        })
                      }}
                      className={className}
                      style={{
                        flex: !width ? '1' : undefined,
                        width,
                        minWidth,
                        maxWidth
                      }}
                    >
                      <Editor
                        tabIndex={tabIndex}
                        inputRef={field.ref}
                        id={index}
                        fieldId={fieldId}
                        row={row as any}
                        rows={rows as any}
                        col={column}
                        form={form as any}
                        value={field.value}
                        onChange={field.onChange}
                        errors={errors?.[index] as FieldErrors<R>}
                        state={state}
                        setState={setState}
                        params={params!}
                        validate={validate}
                        data-editorId={`${index}-${String(key)}`}
                        {...getEditorProps?.({
                          index,
                          row,
                          rows,
                          value: field.value,
                          onChange: field.onChange,
                          col: column,
                          errors: errors?.[index] as FieldErrors<R>
                        })}
                      />
                    </EditableTableCell>
                  )
                }}
              />
            )
          })
        : null}

      {actions.map((action, actionIndex) => (
        <EditableTableCell
          key={action.key}
          className={cn('z-50', actionIndex === 0 && 'border-l')}
          style={{
            width: 100
          }}
        >
          {action.render({ rowIndex: index, row, rows })}
        </EditableTableCell>
      ))}
    </EditableTableRow>
  )
}
