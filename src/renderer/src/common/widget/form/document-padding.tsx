import { AspectRatio } from '@radix-ui/react-aspect-ratio'
import { FormField } from '@renderer/common/components/ui/form'
import { Input } from '@renderer/common/components/ui/input'
import { withForm } from '@renderer/common/hoc'
import { cn } from '@renderer/common/lib/utils'

export const DocumentPaddingFields = withForm<
  {
    paddingLeft: number
    paddingTop: number
    paddingRight: number
    paddingBottom: number
  },
  {
    landscape: boolean
  }
>(({ form, landscape }) => {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-center">
        <span></span>
        <FormField
          control={form.control}
          name="paddingTop"
          render={({ field }) => (
            <Input
              {...field}
              type="number"
              className="w-20"
            />
          )}
        />
        <span></span>
      </div>
      <div className="flex items-center justify-center gap-2">
        <FormField
          control={form.control}
          name="paddingLeft"
          render={({ field }) => (
            <Input
              {...field}
              type="number"
              className="w-20"
            />
          )}
        />
        <div className={cn('w-24', landscape && 'w-32')}>
          <AspectRatio ratio={landscape ? 4 / 3 : 3 / 4}>
            <div className="w-full h-full grid place-content-center border bg-white border-slate-200 text-slate-700 text-2xl font-bold">
              A4
            </div>
          </AspectRatio>
        </div>
        <FormField
          control={form.control}
          name="paddingRight"
          render={({ field }) => (
            <Input
              {...field}
              type="number"
              className="w-20"
            />
          )}
        />
      </div>
      <div className="flex items-center justify-center">
        <span></span>
        <FormField
          control={form.control}
          name="paddingBottom"
          render={({ field }) => (
            <Input
              {...field}
              type="number"
              className="w-20"
            />
          )}
        />
        <span></span>
      </div>
    </div>
  )
})
