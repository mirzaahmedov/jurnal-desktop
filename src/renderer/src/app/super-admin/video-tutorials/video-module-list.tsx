import type { VideoModule } from '@/common/models'

import { useEffect, useState } from 'react'

import { LoadingOverlay } from '@renderer/common/components'
import { Badge } from '@renderer/common/components/ui/badge'
import { Button } from '@renderer/common/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@renderer/common/components/ui/dropdown-menu'
import { Tabs, TabsList, TabsTrigger } from '@renderer/common/components/ui/tabs'
import { useConfirm } from '@renderer/common/features/confirm'
import { useToggle } from '@renderer/common/hooks'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Ellipsis, Pencil, Play, Plus, Trash2 } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'

import { cn } from '@/common/lib/utils'

import { videoModuleQueryKeys } from './config'
import { VideoModuleService } from './service'
import { VideoModuleDialog } from './video-module-dialog'

enum TabOption {
  All = 'all',
  SuperAdmin = 'super-admin',
  Region = 'region'
}

export interface VideoModuleListProps {
  readOnly?: boolean
  selectedId: number | null
  onSelect: (selected: VideoModule) => void
}
export const VideoModuleList = ({
  readOnly = false,
  selectedId,
  onSelect
}: VideoModuleListProps) => {
  const dialogToggle = useToggle()
  const queryClient = useQueryClient()

  const [tabValue, setTabValue] = useState<TabOption>(TabOption.Region)
  const [selected, setSelected] = useState<VideoModule | null>(null)

  const { t } = useTranslation(['app'])
  const { confirm } = useConfirm()

  const { data: videoModules, isFetching: isFetchingVideoModules } = useQuery({
    queryKey: [
      videoModuleQueryKeys.getAll,
      {
        status: tabValue === TabOption.All ? undefined : tabValue === TabOption.SuperAdmin
      }
    ],
    queryFn: VideoModuleService.getAll
  })

  const { mutate: deleteVideoModule, isPending: isDeletingVideoModule } = useMutation({
    mutationFn: VideoModuleService.delete,
    onSuccess: (res) => {
      toast.success(res?.message)

      queryClient.invalidateQueries({
        queryKey: [videoModuleQueryKeys.getAll]
      })
    }
  })

  useEffect(() => {
    if (videoModules?.data?.length && !selectedId) {
      onSelect?.(videoModules.data[0])
    }
  }, [videoModules, selectedId])
  useEffect(() => {
    if (!dialogToggle.isOpen) {
      setSelected(null)
    }
  }, [dialogToggle.isOpen])

  const handleClickCreate = () => {
    setSelected(null)
    dialogToggle.open()
  }
  const handleClickEdit = (row: VideoModule) => {
    setSelected(row)
    requestAnimationFrame(() => dialogToggle.open())
  }
  const handleClickDelete = (row: VideoModule) => {
    requestAnimationFrame(() =>
      confirm({
        onConfirm() {
          deleteVideoModule(row.id)
        }
      })
    )
  }

  return (
    <div className="h-full">
      <Tabs
        value={tabValue}
        onValueChange={(value) => setTabValue(value as TabOption)}
        className="h-full flex flex-col divide-y"
      >
        {readOnly ? null : (
          <div className="p-4 py-4">
            <TabsList className="w-full">
              <TabsTrigger
                className="flex-1 text-xs font-bold text-slate-500 data-[state=active]:text-brand data-[state=active]:shadow-none"
                value={TabOption.All}
              >
                {t('all')}
              </TabsTrigger>
              <TabsTrigger
                className="flex-1 text-xs font-bold text-slate-500 data-[state=active]:text-brand data-[state=active]:shadow-none"
                value={TabOption.SuperAdmin}
              >
                {t('admin')}
              </TabsTrigger>
              <TabsTrigger
                className="flex-1 text-xs font-bold text-slate-500 data-[state=active]:text-brand data-[state=active]:shadow-none"
                value={TabOption.Region}
              >
                {t('region')}
              </TabsTrigger>
            </TabsList>
          </div>
        )}
        <ul className="flex-1 relative">
          {isDeletingVideoModule || isFetchingVideoModules ? (
            <div className="absolute inset-0 flex items-center justify-center">
              <LoadingOverlay />
            </div>
          ) : null}
          {Array.isArray(videoModules?.data)
            ? videoModules.data.map((videoModule) => (
                <li
                  key={videoModule.id}
                  className={cn(
                    'flex items-center gap-3 h-11 px-4 m-1.5 cursor-pointer hover:bg-slate-50 text-slate-600 transition-colors rounded-md',
                    selectedId === videoModule.id && 'text-brand bg-brand/5 hover:bg-brand/5'
                  )}
                  onClick={() => onSelect?.(videoModule)}
                >
                  <Play className="size-4" />
                  <span className="text-sm font-semibold flex-1">{videoModule.name}</span>
                  {tabValue === TabOption.All && videoModule.status ? (
                    <Badge variant="secondary">
                      <span className="text-xs">{t('admin')}</span>
                    </Badge>
                  ) : null}
                  {readOnly ? null : (
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          disabled={isDeletingVideoModule}
                        >
                          <Ellipsis className="btn-icon" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuItem
                          className="cursor-pointer text-sm font-medium"
                          onClick={() => handleClickEdit(videoModule)}
                        >
                          <Pencil className="btn-icon" /> {t('edit')}
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="cursor-pointer text-red-500 hover:!text-red-500 text-sm font-medium"
                          onClick={() => handleClickDelete(videoModule)}
                        >
                          <Trash2 className="btn-icon" /> {t('delete')}
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  )}
                </li>
              ))
            : null}
        </ul>
        {readOnly ? null : (
          <div className="p-5 text-center">
            <Button onClick={handleClickCreate}>
              {t('add')}
              <Plus className="btn-icon" />
            </Button>
          </div>
        )}
        <VideoModuleDialog
          open={dialogToggle.isOpen}
          onOpenChange={dialogToggle.setOpen}
          selected={selected}
        />
      </Tabs>
    </div>
  )
}
