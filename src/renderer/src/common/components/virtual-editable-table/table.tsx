import type { VirtualEditableColumnDef, VirtualEditableRowProps } from './interfaces'
import type { VirtualEditableTableProps } from './interfaces'
import type { ArrayPath, Path } from 'react-hook-form'

import { useImperativeHandle, useRef, useState } from 'react'

import { useVirtualizer } from '@tanstack/react-virtual'
import { CircleMinus } from 'lucide-react'
import { Controller, useFieldArray } from 'react-hook-form'
import { useTranslation } from 'react-i18next'

import { Button } from '@/common/components/ui/button'
// import { Table, TableFooter, TableHeader } from '@/common/components/ui/table'
import { cn } from '@/common/lib/utils'

import { EmptyList } from '../empty-states'
import { inputVariants } from '../ui/input'
import { TableCell, TableHead, TableRow } from './components'
import { getLeafColumns, getMaxDepth, handleStickyColumns } from './utils'

export const VirtualEditableTable = <T extends object, F extends ArrayPath<NoInfer<T>>>(
  props: VirtualEditableTableProps<T, F>
) => {
  const {
    readOnly,
    disableHeader = false,
    tableRef,
    tabIndex,
    name,
    form,
    columnDefs,
    className,
    divProps,
    placeholder,
    onRowCreate,
    onDelete,
    onCellDoubleClick,
    params = {},
    validate,
    getEditorProps,
    getRowClassName,
    methods
  } = props

  const highlightedRow = useRef<number | null>(null)
  const innerRef = useRef<HTMLTableElement>(null)

  const containerRef = useRef<HTMLDivElement>()

  const ref = tableRef || innerRef

  const { t } = useTranslation()

  const { fields: rows } = useFieldArray({
    control: form.control,
    name
  })

  const rowVirtualizer = useVirtualizer({
    count: rows.length,
    getScrollElement: () => ref.current,
    estimateSize: () => 44,
    overscan: 10
  })

  useImperativeHandle(
    methods,
    () => ({
      scrollToRow: (rowIndex: number) => {
        rowVirtualizer.scrollToIndex(rowIndex, {
          align: 'center',
          behavior: 'smooth'
        })
        highlightedRow.current = rowIndex
      }
    }),
    [rowVirtualizer]
  )

  const maxDepth = getMaxDepth(columnDefs)
  const leafColumns = getLeafColumns(columnDefs)

  const gridTemplateColumns = leafColumns
    .map((column) => (column.width ? `${column.width}px` : '1fr'))
    .join(' ')

  return null

  // return (
  //   <div
  //     {...divProps}
  //     onScroll={(e) => {
  //       const container = e.currentTarget
  //       handleStickyColumns(container)
  //     }}
  //     ref={(ref) => {
  //       if (ref) {
  //         containerRef.current = ref
  //         handleStickyColumns(ref)
  //       }
  //     }}
  //     className={cn('h-full w-full overflow-x-auto', divProps?.className)}
  //     onFocus={(e) => {
  //       e.target.scrollIntoView({
  //         behavior: 'smooth',
  //         block: 'nearest'
  //       })
  //     }}
  //   >
  //     <div className="h-full min-w-min flex flex-col">
  //       {!disableHeader ? (
  //         <div className="divide-y w-full min-w-min">
  //           <div
  //             className="w-full min-w-min grid divide-x bg-white"
  //             style={{
  //               gridTemplateColumns,
  //               gridAutoRows: '40px'
  //             }}
  //           >
  //             {columnDefs.map((column, index) => (
  //               <>
  //               {index === 0 ? (
  //       //               <TableHead
  //       //                 key="line_number"
  //       //                 className="px-3 whitespace-nowrap text-sm font-medium"
  //       //                 style={{
  //       //                   width: `${String(rows.length + 1).length + 3}ch`
  //       //                 }}
  //       //                 rowSpan={headerRows.length}
  //       //               ></TableHead>
  //       //             ) : null}
  //       //             {Array.isArray(row)
  //       //               ? row.map((column) => {
  //       //                   const {
  //       //                     _colSpan,
  //       //                     _rowSpan,
  //       //                     key,
  //       //                     header,
  //       //                     width,
  //       //                     minWidth,
  //       //                     maxWidth,
  //       //                     headerClassName
  //       //                   } = column
  //       //                   return (
  //       //                     <TableHead
  //       //                       key={String(key)}
  //       //                       style={{
  //       //                         width,
  //       //                         minWidth,
  //       //                         maxWidth
  //       //                       }}
  //       //                       colSpan={_colSpan}
  //       //                       rowSpan={_rowSpan}
  //       //                       className={headerClassName}
  //       //                     >
  //       //                       {!header
  //       //                         ? t(key.toString())
  //       //                         : typeof header === 'string'
  //       //                           ? t(header)
  //       //                           : null}
  //       //                     </TableHead>
  //       //                   )
  //       //                 })
  //       //               : null}
  //       //             {typeof onDelete === 'function' && index === 0 ? (
  //       //               <TableHead key="delete"></TableHead>
  //       //             ) : null}
  //               </>
  //               <HeaderCell
  //                 key={column.header}
  //                 column={column}
  //                 depth={1}
  //                 maxDepth={maxDepth}
  //                 startCol={leafColumns
  //                   .slice(0, index)
  //                   .reduce((acc, c) => acc + getLeafColumns([c]).length, 1)}
  //               />
  //             ))}
  //           </div>
  //         </div>
  //       ) :
  //       // <Table className={cn('border border-slate-200 table-fixed', className)}>
  //       //   <TableHeader className="shadow-sm">
  //       //     {Array.isArray(columnDefs)
  //       //       ? headerRows.map((row, index) => (
  //       //           <TableRow key={index}>
  //       //             {index === 0 ? (
  //       //               <TableHead
  //       //                 key="line_number"
  //       //                 className="px-3 whitespace-nowrap text-sm font-medium"
  //       //                 style={{
  //       //                   width: `${String(rows.length + 1).length + 3}ch`
  //       //                 }}
  //       //                 rowSpan={headerRows.length}
  //       //               ></TableHead>
  //       //             ) : null}
  //       //             {Array.isArray(row)
  //       //               ? row.map((column) => {
  //       //                   const {
  //       //                     _colSpan,
  //       //                     _rowSpan,
  //       //                     key,
  //       //                     header,
  //       //                     width,
  //       //                     minWidth,
  //       //                     maxWidth,
  //       //                     headerClassName
  //       //                   } = column
  //       //                   return (
  //       //                     <TableHead
  //       //                       key={String(key)}
  //       //                       style={{
  //       //                         width,
  //       //                         minWidth,
  //       //                         maxWidth
  //       //                       }}
  //       //                       colSpan={_colSpan}
  //       //                       rowSpan={_rowSpan}
  //       //                       className={headerClassName}
  //       //                     >
  //       //                       {!header
  //       //                         ? t(key.toString())
  //       //                         : typeof header === 'string'
  //       //                           ? t(header)
  //       //                           : null}
  //       //                     </TableHead>
  //       //                   )
  //       //                 })
  //       //               : null}
  //       //             {typeof onDelete === 'function' && index === 0 ? (
  //       //               <TableHead key="delete"></TableHead>
  //       //             ) : null}
  //       //           </TableRow>
  //       //         ))
  //       //       : null}
  //       //   </TableHeader>
  //       // </Table>
  //       null}

  //       <div
  //         className="w-min min-w-full overflow-y-auto overflow-x-hidden flex-1 scrollbar"
  //         ref={ref}
  //       >
  //         <div style={{ height: `${rowVirtualizer.getTotalSize()}px` }}>
  //           <div
  //             className="grid"
  //             style={{ gridTemplateColumns }}
  //           >
  //             {Array.isArray(rows) && rows.length ? (
  //               rowVirtualizer.getVirtualItems().map((virtualRow, index) => {
  //                 const row = rows[virtualRow.index]
  //                 return (
  //                   <TableRow
  //                     key={virtualRow.index}
  //                     rowRef={(element) => {
  //                       if (index === highlightedRow?.current) {
  //                         highlightedRow.current = null
  //                         const input = element?.querySelector(
  //                           `[data-rowindex="${index}"] input`
  //                         ) as HTMLInputElement
  //                         input?.focus()
  //                       }
  //                     }}
  //                     data-rowindex={index}
  //                     className={getRowClassName?.({ index, row, rows })}
  //                     focusable={rows.length > 1}
  //                     style={{
  //                       height: `${virtualRow.size}px`,
  //                       transform: `translateY(${virtualRow.start - index * virtualRow.size}px)`
  //                     }}
  //                   >
  //                     <RowColumns
  //                       index={virtualRow.index}
  //                       readOnly={readOnly}
  //                       startRowNumber={1}
  //                       tabIndex={tabIndex}
  //                       row={row as any}
  //                       rows={rows as any}
  //                       name={name}
  //                       form={form}
  //                       columnDefs={columnDefs}
  //                       leafColumns={leafColumns}
  //                       onDelete={onDelete}
  //                       onCellDoubleClick={onCellDoubleClick}
  //                       params={params}
  //                       validate={validate}
  //                       getEditorProps={getEditorProps}
  //                     />
  //                   </TableRow>
  //                 )
  //               })
  //             ) : (
  //               <TableRow>
  //                 <TableCell
  //                   colSpan={100}
  //                   className="text-center py-5"
  //                 >
  //                   <EmptyList
  //                     iconProps={{
  //                       className: 'w-40'
  //                     }}
  //                   >
  //                     {placeholder}
  //                   </EmptyList>
  //                 </TableCell>
  //               </TableRow>
  //             )}
  //           </div>
  //         </div>
  //       </div>
  //     </div>

  //     {/* {footerRows ? (
  //       <Table className={cn('border border-slate-200 table-fixed', className)}>
  //         <TableFooter className="shadow-sm">
  //           {Array.isArray(footerRows)
  //             ? footerRows.map((row, index) => (
  //                 <TableRow key={index}>
  //                   <FooterRowColumns
  //                     index={index}
  //                     readOnly={readOnly}
  //                     startRowNumber={rows.length}
  //                     tabIndex={tabIndex}
  //                     row={row as any}
  //                     rows={rows as any}
  //                     name={name}
  //                     form={form}
  //                     columnDefs={columnDefs}
  //                     leafColumns={leafColumns}
  //                     onDelete={onDelete}
  //                     onCellDoubleClick={onCellDoubleClick}
  //                     params={params}
  //                     validate={validate}
  //                     getEditorProps={getEditorProps}
  //                   />
  //                 </TableRow>
  //               ))
  //             : null}
  //         </TableFooter>
  //       </Table>
  //     ) : null} */}
  //     // {onRowCreate ? (
  //     //   <Button
  //     //     tabIndex={tabIndex}
  //     //     type="button"
  //     //     variant="ghost"
  //     //     className="w-full sticky left-0 right-0 hover:bg-slate-50 text-brand hover:text-brand"
  //     //     onClick={onRowCreate}
  //     //   >
  //     //     <CirclePlus className="btn-icon icon-start" /> {t('add')}
  //     //   </Button>
  //     // ) : null}
  //   </div>
  // )
}

// const RowColumns = <T extends object, F extends ArrayPath<NoInfer<T>>>({
//   readOnly,
//   startRowNumber = 1,
//   tabIndex,
//   index,
//   columnDefs,
//   leafColumns,
//   row,
//   rows,
//   name,
//   form,
//   onDelete,
//   onCellDoubleClick,
//   params,
//   validate,
//   getEditorProps
// }: VirtualEditableRowProps<T, F>) => {
//   const [state, setState] = useState<Record<string, unknown>>({})

//   return (
//     <>
//       <TableCell
//         key="line_number"
//         className="px-3 font-medium"
//         style={{
//           width: `${String(rows.length + startRowNumber).length + 3}ch`
//         }}
//       >
//         {index + startRowNumber}
//       </TableCell>
//       {Array.isArray(columnDefs)
//         ? leafColumns.map((column) => {
//             const { key, Editor, width, minWidth, maxWidth, className, sticky, left, right } =
//               column
//             return (
//               <Controller
//                 key={String(key)}
//                 control={form.control}
//                 name={`${name}.${index}.${String(key)}` as Path<T>}
//                 render={({ field, fieldState }) => {
//                   return (
//                     <TableCell
//                       style={{ width, minWidth, maxWidth }}
//                       className={className}
//                       data-sticky={sticky ? true : undefined}
//                       data-left={left !== undefined ? left : undefined}
//                       data-right={right !== undefined ? right : undefined}
//                       onDoubleClick={(event) => {
//                         onCellDoubleClick?.({
//                           column,
//                           row,
//                           rows,
//                           value: field.value,
//                           onChange: field.onChange,
//                           event,
//                           index
//                         })
//                       }}
//                     >
//                       <Editor
//                         tabIndex={tabIndex}
//                         inputRef={field.ref}
//                         index={index}
//                         row={row}
//                         rows={rows}
//                         column={column}
//                         form={form}
//                         value={field.value}
//                         onChange={field.onChange}
//                         error={fieldState.error}
//                         state={state}
//                         setState={setState}
//                         params={params!}
//                         validate={validate}
//                         data-editorId={`${index}-${String(key)}`}
//                         readOnly={readOnly}
//                         {...getEditorProps?.({
//                           index,
//                           row,
//                           rows,
//                           value: field.value,
//                           onChange: field.onChange,
//                           column
//                         })}
//                       />
//                     </TableCell>
//                   )
//                 }}
//               />
//             )
//           })
//         : null}
//       {onDelete ? (
//         <TableCell
//           className="whitespace-nowrap w-0"
//           data-sticky="true"
//           data-right="0"
//         >
//           <Button
//             tabIndex={tabIndex}
//             type="button"
//             variant="ghost"
//             className="hover:bg-slate-50 hover:text-red-500 text-red-400"
//             onClick={() => onDelete?.({ id: index })}
//           >
//             <CircleMinus className="btn-icon !mx-0" />
//           </Button>
//         </TableCell>
//       ) : null}
//     </>
//   )
// }

// const FooterRowColumns = <T extends object, F extends ArrayPath<NoInfer<T>>>({
//   startRowNumber = 1,
//   tabIndex,
//   index,
//   columnDefs,
//   leafColumns,
//   row,
//   rows,
//   onDelete
// }: VirtualEditableRowProps<T, F>) => {
//   return (
//     <>
//       <TableCell
//         key="line_number"
//         className="px-3 font-medium"
//         style={{
//           width: `${String(rows.length + startRowNumber).length + 3}ch`
//         }}
//       >
//         {index + startRowNumber}
//       </TableCell>
//       {Array.isArray(columnDefs)
//         ? leafColumns.map((column) => {
//             const { key, width, minWidth, maxWidth, className, sticky, left, right } = column
//             return (
//               <TableCell
//                 key={String(key)}
//                 style={{ width, minWidth, maxWidth }}
//                 className={className}
//                 data-sticky={sticky ? true : undefined}
//                 data-left={left !== undefined ? left : undefined}
//                 data-right={right !== undefined ? right : undefined}
//               >
//                 <input
//                   readOnly
//                   tabIndex={-1}
//                   value={row[String(key)]}
//                   className={inputVariants({
//                     editor: true
//                   })}
//                 />
//               </TableCell>
//             )
//           })
//         : null}
//       {onDelete ? (
//         <TableCell
//           className="whitespace-nowrap w-0"
//           data-sticky="true"
//           data-right="0"
//         >
//           <Button
//             tabIndex={tabIndex}
//             type="button"
//             variant="ghost"
//             className="hover:bg-slate-50 hover:text-red-500 text-red-400"
//             onClick={() => onDelete?.({ id: index })}
//           >
//             <CircleMinus className="btn-icon !mx-0" />
//           </Button>
//         </TableCell>
//       ) : null}
//     </>
//   )
// }

// interface VirtualEditableHeaderCellProps<T extends object, F extends ArrayPath<NoInfer<T>>> {
//   columnDef: VirtualEditableColumnDef<T>;
//   depth: number;
//   minSize?: number;
//   maxDepth: number;
//   startCol: number;
// };
// const VirtualEditableHeaderCell = <T extends object, F extends ArrayPath<NoInfer<T>>>({
//    columnDef,
//   depth,
//   maxDepth,
//   startCol,
//  }: VirtualEditableHeaderCellProps<T, F>) => {
//   const leafCount = columnDef.columns ? getLeafColumns(columnDef.columns).length : 1;
//   const colSpan = leafCount;
//   const rowSpan = columnDef.columns ? 1 : maxDepth - depth + 1;

//   return (
// <>
//       <div
//         style={{
//           gridColumn: `${startCol} / span ${colSpan}`,
//           gridRow: `${depth} / span ${rowSpan}`,
//           minWidth: columnDef.minWidth,
//         }}
//         data-sticky={columnDef.sticky ? true : undefined}
//         data-left={columnDef.left !== undefined ? columnDef.left : undefined}
//         data-right={columnDef.right !== undefined ? columnDef.right : undefined}
//         className="font-bold text-center border-b flex items-center justify-center bg-inherit"
//       >
//         {columnDef.header}
//       </div>
//       {
//         columnDef.columns?.reduce(
//           (acc, child) => {
//             const childStart = startCol + acc.totalLeafCount;
//             const childResult = (
//               <HeaderCell
//                 key={`${child.header}-${childStart}`}
//                 column={child}
//                 depth={depth + 1}
//                 maxDepth={maxDepth}
//                 startCol={childStart}
//               />
//             );
//             return {
//               totalLeafCount:
//                 acc.totalLeafCount + getLeafColumns([child]).length,
//               elements: [...acc.elements, childResult],
//             };
//           },
//           { totalLeafCount: 0, elements: [] as React.ReactNode[] }
//         ).elements
//       }
//     </>
//   )
// }
