import { useEffect } from 'react'

import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { toast } from 'react-toastify'

import { EditableTable } from '@/common/components/editable-table'
import {
  createEditorCreateHandler,
  createEditorDeleteHandler,
  createEditorDuplicateHandler
} from '@/common/components/editable-table/helpers'
import { Form } from '@/common/components/ui/form'
import { useRequisitesStore } from '@/common/features/requisites'
import { useLayout } from '@/common/layout'
import { DetailsView } from '@/common/views'

import { MaterialSaldoService } from '../service'
import {
  MaterialCreateFormSchema,
  type MaterialCreateFormValues,
  MaterialCreateProvodkaFormSchema,
  defaultValues
} from './config'
import { provodkiColumns } from './provodki'

const MaterialCreatePage = () => {
  const setLayout = useLayout()
  const navigate = useNavigate()

  const [searchParams] = useSearchParams()

  const { budjet_id, main_schet_id } = useRequisitesStore()
  const { t } = useTranslation(['app'])

  const year = searchParams.get('year')
  const month = searchParams.get('month')

  const form = useForm<MaterialCreateFormValues>({
    defaultValues: defaultValues,
    resolver: zodResolver(MaterialCreateFormSchema)
  })

  const { mutate: createMany, isPending } = useMutation({
    mutationFn: MaterialSaldoService.createMany,
    onSuccess: (res) => {
      toast.success(res?.message)
      navigate(-1)
    }
  })

  const handleSubmit = form.handleSubmit((values) => {
    if (!budjet_id || !main_schet_id || !year || !month) {
      toast.error('Необходимо выбрать бюджет и главный счет')
      return
    }
    createMany({
      budjet_id,
      main_schet_id,
      year: Number(year),
      month: Number(month),
      data: values.data
    })
  })

  useEffect(() => {
    setLayout({
      title: t('create'),
      onBack: () => navigate(-1),
      breadcrumbs: [
        {
          title: t('pages.material-warehouse')
        },
        {
          title: t('pages.saldo'),
          path: 'journal-7/saldo'
        }
      ]
    })
  }, [t, navigate, setLayout])

  return (
    <DetailsView>
      <DetailsView.Content loading={isPending}>
        <Form {...form}>
          <form onSubmit={handleSubmit}>
            <div className="w-full overflow-x-auto scrollbar">
              <EditableTable
                form={form}
                name="data"
                errors={form.formState.errors?.data}
                columnDefs={provodkiColumns}
                onCreate={createEditorCreateHandler({
                  form,
                  defaultValues: defaultValues.data[0],
                  field: 'data',
                  schema: MaterialCreateProvodkaFormSchema
                })}
                onDelete={createEditorDeleteHandler({
                  form,
                  field: 'data'
                })}
                onDuplicate={createEditorDuplicateHandler({
                  form,
                  field: 'data'
                })}
              />

              <DetailsView.Footer>
                <DetailsView.Create />
              </DetailsView.Footer>
            </div>
          </form>
        </Form>
      </DetailsView.Content>
    </DetailsView>
  )
}

export default MaterialCreatePage
